'use strict';

const got = require('got');
const logger = require('./logger.js').logger;
const appConfig = require('./app-config.js'); 
var __ = require('underscore');
const msal = require('@azure/msal-node');
const Crypto = require('crypto');


async function requestAccessTokenUsingAuthCode(request, reply, authCode) {


    var accessToken;
    const requestConfig = appConfig.msalConfig.request;

    if (__.isEmpty(request.session.pkceCodes)) {
        // if the session object does not contain the pkceCodes in return to callback, this
        // indicates that a new session has been created. A sympton of the "sessionID" cookie
        // not following with the redirect - samesite setting for the cookie

        logger.error(
            'No session object in callback auth redirect, aborting authentication.'
        );
        return '';
    }

    const tokenRequest = {
        ...requestConfig.tokenRequest,
        code: authCode,
        codeVerifier: request.session.pkceCodes.verifier, // PKCE Code Verifier
    };

    //https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.confidentialclientapplication.html#acquiretokenbycode

    await confidentialClientApplication
        .acquireTokenByCode(tokenRequest)
        .then((response) => {
            accessToken = response.accessToken;
            logger.debug('Got accessToken: ' + accessToken);

            //storing homeAccountID in session
            request.session.homeAccountId = response.account.homeAccountId;
            logger.debug(
                'Setting homeAccountId into session cookie: ' +
                    request.session.homeAccountId
            );
        })
        .catch((error) => {
            logger.error('Failed to get access token');
            logger.error(error);
        });

    return accessToken;

}


async function getTokenAuthCode (request, reply) {
    const requestConfig = appConfig.msalConfig.request;
    const { authCodeUrlParameters } = requestConfig;
    var redirectUrl = '';

    if (request.query) {
        // Check for the state parameter
        if (request.query.state)
            authCodeUrlParameters.state = request.query.state;

        // Check for the prompt parameter
        if (request.query.prompt)
            authCodeUrlParameters.prompt = request.query.prompt;

        // Check for the loginHint parameter
        if (request.query.loginHint)
            authCodeUrlParameters.loginHint = request.query.loginHint;

        // Check for the domainHint parameter
        if (request.query.domainHint)
            authCodeUrlParameters.domainHint = request.query.domainHint;
    }

    // Set up PKCE Code object in the session object
        request.session.pkceCodes = {
            challengeMethod: 'S256', // Use SHA256 Algorithm
            verifier: '', // Generate a code verifier for the Auth Code Request first
            challenge: '', // Generate a code challenge from the previously generated code verifier
    };

  

    // Initialize CryptoProvider instance
    const cryptoProvider = new msal.CryptoProvider();
    // Generate PKCE Codes before starting the authorization flow
    await cryptoProvider.generatePkceCodes().then(({ verifier, challenge }) => {
        // Set generated PKCE Codes as app variables
        request.session.pkceCodes.verifier = verifier;
        request.session.pkceCodes.challenge = challenge;

        authCodeUrlParameters.codeChallenge = challenge;
        authCodeUrlParameters.codeChallengeMethod = request.session.pkceCodes.challengeMethod;
    });
 
   logger.debug(request.session.pkceCodes);


    //https://learn.microsoft.com/en-us/javascript/api/%40azure/msal-node/confidentialclientapplication?view=msal-js-latest#@azure-msal-node-confidentialclientapplication-acquiretokenbycode
    await confidentialClientApplication
        .getAuthCodeUrl(requestConfig.authCodeUrlParameters)
        .then((authCodeUrl) => {
            logger.debug(
                'Got redirect url for auth code request: ' + authCodeUrl
            );
            redirectUrl = authCodeUrl;
        })
        .catch((error) => {
            logger.error('Failed to get redirect url for code request');
            logger.error(error);
        });

    if (!__.isEmpty(redirectUrl)) {
        reply.redirect(302, redirectUrl);
    } else {
        reply.code(500).send('Redirect to get auth code failed');
    }
}

//Using access_token to query the MS graph api for users inbox
//Returning an object with sender and subject for the messages
async function readInbox(accessToken) {
    var newMails = [];

    var requestHeaders = {
        'user-agent': clientUserAgent(),
        Authorization: 'Bearer ' + accessToken,
    };

    try {
        logger.debug('Preparing to read inbox ...');
        const response = await got.get(
            "https://graph.microsoft.com/v1.0/me/mailFolders('Inbox')/messages?$select=sender,subject",
            {
                headers: requestHeaders,
                retry: 1
            }
        );

        logger.debug('Got inbox - building response');

        var mailBody = JSON.parse(response.body);

        __.each(mailBody.value, function (item, index) {
            newMails.push(item.sender.emailAddress.name + ' - ' + item.subject);
        });

        return newMails;

    } catch (error) {
        logger.error('Request for emails failed: ' + error);
        return newMails;
    }
}


//Generate useragent header (used by webserver and got)

function clientUserAgent()  {

    const pkg = require('../package.json');

    if (__.has(pkg,'useragent')) {
        logger.debug('Setting useragent to ' + pkg.useragent);
        return pkg.useragent;
    } else {
        logger.debug('Setting useragent to empty');
        return 'generic'
    }

}

// Logs the user out by clearing token cache and destroying the session
async function logoutSessionUser(request, reply){

    logger.debug('About to logout ' + request.session.homeAccountId);

    if (!__.isUndefined(request.session.homeAccountId)) {
        
        const account = await msalTokenCache.getAccountByHomeId(
            request.session.homeAccountId
        );

        logger.debug('About to remove account from token cache ' + account.homeAccountId);

        
        if (__.size(account) > 0) {

            //Trying to remove account from token cache
            await msalTokenCache
                .removeAccount(account)
                .then(() => {
                    logger.debug(
                        'Account deleted from cache ' + account.homeAccountId
                    );
                })
                .catch((error) => {
                    logger.error('Failed to remove account from token cache');
                    logger.error(error);
                });

            //Clearing out the session object
            request.session.destroy((error) => {
                if (error) {
                    logger.error('Unable to destroy session ' + error);
                } else {
                    logger.debug('Destroyed session');
                }
            });
        };
    }
};


//Getting an access token silently
//Requires a scope array for the scopes to request
async function getTokenSilently (scopes,request, reply) {
    
    var accessToken = '';

    const account = await msalTokenCache.getAccountByHomeId(
        request.session.homeAccountId
    );

    const silentRequest = {
        ...appConfig.msalConfig.request.silentRequest,
        account: account,
    };

    silentRequest.scopes = scopes;

    logger.debug('Silent request:: ' + JSON.stringify(silentRequest));

    await confidentialClientApplication
        .acquireTokenSilent(silentRequest)
        .then((authResponse) => {
            logger.debug('Got access token silently ' + authResponse.accessToken);
            accessToken = authResponse.accessToken;         
        })
        .catch((error) => {
            logger.error('Failed to get access token silently');
            logger.error(error);
        });

    return accessToken;
};

//A helper function returning true if user/session is authenticated
//Another way of doing this is using pre-validation as shown for the /showinbox route
function isAuthenticated(request) {

    if (!__.isUndefined(request.session.homeAccountId)) {
        return true
    } else {
        return false
    }
}

//Helper function to return  account objectName object
//Reading info from MSAL token cache
//Alternative could be to put the names inside the session object
async function getAccountName(homeAccountId) {

    var accountName = {};
    const account = await msalTokenCache.getAccountByHomeId(homeAccountId);

    if (!__.isUndefined(account)) {
        accountName = {
            username: account.username,
            name: account.name
        };
    };

    return accountName;

};

//Helper function generate random key
//Used for cookie secret
function generateRandomKey (size) {

    const key = Crypto
                    .randomBytes(size)
                    .toString('base64')
                    .slice(0,size)

    logger.debug('Creating new random key : ' + key);

    return key
}



//
// Building the objects global to the module
// This will be MSAL client and relevant config
//

// Persisting MSAL token Cache into un-encrypted file.
// Token cache has no partition on sessionId. 
// A user having multiple session will use the same token cache.
// This is an "non-production pattern" - for exploitative testing only!!
const cacheFile = appConfig.msalConfig.cache.file;
const cachePlugin = require('./cachePlugin')(cacheFile);

const msalLogLevel = require('../lib/logger.js').loglevel().msal;

logger.info('Cache file: ' + cacheFile);
logger.info('msal log level: ' + msalLogLevel);

//Config for msal logger
const loggerOptions = {
    loggerCallback(loglevel, message, containsPii) {
        const lmessage = message.split(' : ');
        logger.debug('msal: ' + lmessage[3]);
    },
    piiLoggingEnabled: false,
    logLevel: msalLogLevel,
};
    
//Config for msal client app 
//https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.confidentialclientapplication.html
var clientConfig = {
    auth: appConfig.msalConfig.authOptions,
    cache: {
        cachePlugin,
    },
    system: {
        loggerOptions: loggerOptions,
        // proxyUrl: "http://127.0.0.1:8080"
    },
};

//Creating the msal client and token cache
const confidentialClientApplication = new msal.ConfidentialClientApplication(clientConfig);
const msalTokenCache = confidentialClientApplication.getTokenCache();

module.exports = {
    getTokenAuthCode,
    requestAccessTokenUsingAuthCode,
    readInbox,
    clientUserAgent,
    logoutSessionUser,
    getTokenSilently,
    isAuthenticated,
    getAccountName,
    generateRandomKey,
};