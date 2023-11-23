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
    const tokenRequest = {
        ...requestConfig.tokenRequest,
        code: authCode,
    };

    //https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.confidentialclientapplication.html#acquiretokenbycode

    await confidentialClientApplication
        .acquireTokenByCode(tokenRequest)
        .then((response) => {
            accessToken = response.accessToken;
            logger.debug('Got accessToken: ' + accessToken);

            // if (!__.isEmpty(response.idToken)) {
            //     logger.debug('Got ID token: ' + response.idToken);
            // }

            // Output the MSAL token cache to the log
            // logger.debug(msalTokenCache.serialize());

            //storing homeAccountID in session
            request.session.homeAccountId = response.account.homeAccountId;
            logger.debug(
                'Setting homeAccountId into session cookie: ' +
                    request.session.homeAccountId
            );

            //Storing msal token cache in session
            logger.debug(
                'Serializing msal token cache in session for ' +
                    request.session.homeAccountId +
                    ' with session id ' +
                    request.session.sessionId
            );
            request.session.tokenCache = msalTokenCache.serialize();
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

    //https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.confidentialclientapplication.html#getauthcodeurl
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
        logger.info('Preparing to read inbox ...');
        const response = await got.get(
            "https://graph.microsoft.com/v1.0/me/mailFolders('Inbox')/messages?$select=sender,subject",
            {
                headers: requestHeaders
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
async function getTokenSilently (request, reply) {
    var accessToken = '';

    //Reading msal token cache from session
    logger.debug('Deserializing msal token cache from session id ' + request.session.sessionId + ' for account ' +  request.session.homeAccountId);
    msalTokenCache.deserialize(request.session.tokenCache);

    const account = await msalTokenCache.getAccountByHomeId(
        request.session.homeAccountId
    );

    const silentRequest = {
        ...appConfig.msalConfig.request.silentRequest,
        account: account,
    };

    await confidentialClientApplication
        .acquireTokenSilent(silentRequest)
        .then((authResponse) => {
            logger.debug('Got access token silently ' + authResponse.accessToken);
            accessToken = authResponse.accessToken;
        })
        .catch((error) => {
            logger.error('Failed to get access token silently');
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

//Helper function to return  account objetName object
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

//Helper function to return  app roles in Id token
//Reading info from MSAL token cache
async function getAccountAppRoles(homeAccountId) {

    var appRoles = [];
    const account = await msalTokenCache.getAccountByHomeId(homeAccountId);

    if (!__.isUndefined(account.idTokenClaims)) {
        appRoles = account.idTokenClaims.roles
    };

    return appRoles;

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

const msalLogLevel = require('../lib/logger.js').loglevel().msal;

logger.info('MSAL cache is stored in memory using the sessions');
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
const clientConfig = {
    auth: appConfig.msalConfig.authOptions,
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
    getAccountAppRoles,
    generateRandomKey,
};