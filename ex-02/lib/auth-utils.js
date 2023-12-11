'use strict';

const got = require('got');
const logger = require('./logger.js').logger;
const appConfig = require('./app-config.js'); 
var __ = require('underscore');
const url = require('url');

//Used in the auth code flow, request an access_token using the auth_code 
async function requestAccessTokenUsingAuthCode(authCode) {
    var requestHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'user-agent': clientUserAgent(),
        Authorization:
            'Basic ' +
            encodeClientCredentials(
                appConfig.clientConfig.client_id,
                appConfig.clientConfig.client_secret
            ),
    };

    var requestBody = new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: appConfig.clientConfig.redirect_uri,
    }).toString();

    try {
        logger.info(
            'Requesting access token at ' + appConfig.serverConfig.tokenEndpoint
        );
        const response = await got.post(appConfig.serverConfig.tokenEndpoint, {
            headers: requestHeaders,
            body: requestBody,
        });

        var responseBody = JSON.parse(response.body);
        
        logger.debug('AccessToken in response : ' + responseBody.access_token);
        return responseBody.access_token;

    } catch (error) {
        logger.error('Request for access token failed: ' + error);
        return "";
    }
}

//Support for https://tools.ietf.org/html/rfc6749#section-2.3
//Preparing the client credentials for the authorization header
var encodeClientCredentials = function (clientId, clientSecret) {
    return new Buffer.from(
        encodeURIComponent(clientId) + ':' + encodeURIComponent(clientSecret)
    ).toString('base64');
};

// A generic function to build a proper url from base and search params
function buildUrl(base, searchP) {

    var newUrl = new URL(base);
    
    __.each(searchP, function (value, key) {
        newUrl.searchParams.append(key, value);
    });

    return url.format(newUrl);
};

// Construct url that will be used the trigger the authorize part of the workflow
function buildAuthorizeUrl(state, scope, responseMode) {

    logger.info('Building URL to OAuth authorization end-point');
 
    var redirectUrl = buildUrl(appConfig.serverConfig.authorizationEndpoint, {
        response_type: 'code',
        client_id: appConfig.clientConfig.client_id,
        redirect_uri: appConfig.clientConfig.redirect_uri,
        state: state,
        scope: scope,
        response_mode: responseMode,
        prompt: 'select_account',
        // response_mode: 'form_post',
        // response_mode: 'query',
    });

    logger.debug('Returning URL : ' + redirectUrl);
    return redirectUrl;
}

//Reading access_token to query the MS graph api for users inbox
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

module.exports = {
    requestAccessTokenUsingAuthCode,
    buildUrl,
    buildAuthorizeUrl,
    readInbox,
    clientUserAgent
};