'use strict';

const logger = require('./logger.js').logger;
const appConfig = require('./app-config.js'); 
var __ = require('underscore');
const msal = require('@azure/msal-node');

async function requestAccessTokenUsingAuthCode(authCode) {

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
        logger.info('Preparing to read inbox ...');

        const got = (await import('got')).default;

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

//
// Building the objects global to the module
// This will be MSAL client and relevant config
//

const msalLogLevel = require('../lib/logger.js').loglevel().msal;

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

//Creating the msal client
const confidentialClientApplication = new msal.ConfidentialClientApplication(clientConfig);

module.exports = {
    getTokenAuthCode,
    requestAccessTokenUsingAuthCode,
    readInbox,
    clientUserAgent
};