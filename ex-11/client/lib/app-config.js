'use strict';

const __ = require('underscore');
const logger = require('./logger.js').logger;
const fs = require('fs');

// Configuration Objects
logger.info('Building configuration');

const port = process.env.PORT || '3000';
const host = process.env.HOST || '127.0.0.1';

const tenantId = process.env.TENANT_ID;
const gotEpisodesApiUrl = process.env.EPISODES_API_URL;
const tokenCacheFile = process.env.TOKEN_CACHE_FILE;

//request:  https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationurlrequest
const msalConfig = {
    authOptions: {
        clientId: process.env.CLIENT_ID,
        authority: 'https://login.microsoftonline.com/' + tenantId,
        clientSecret: process.env.CLIENT_SECRET,
    },
    request: {
        authCodeUrlParameters: {
            scopes: ['user.read', 'mail.read'],
            redirectUri: process.env.REDIRECT_URI,
            responseMode: 'query',
            // responseMode: 'form_post',
            // prompt: 'none',
        },
        tokenRequest: {
            redirectUri: process.env.REDIRECT_URI,
            scopes: [],
        },
        silentRequest: {
            scopes: [],
            prompt: 'consent',
        },
    },
    resourceApi: {
        endpoint: 'https://graph.microsoft.com/v1.0/me',
    },
    cache: {
        file: tokenCacheFile,
    },
    scopes: {
        gotApi: ['api://' + process.env.EPISODES_API_URI + '/episodes.read'],
        inbox: ['user.read', 'mail.read'],
    },
};

//A helper function to check if cache file exists, if not then try to create it
//Doing this in sync mode - we need the cache file to continue
function handleTokeCacheFile(cFile) {

    if (fs.existsSync(cFile)) {
        logger.info('Token Cache file does exist at ' + cFile);
    } else {
        logger.info(
            'Token Cache file did not exist - trying to create ' + cFile);

        try {
            const cf = fs.openSync(cFile, 'w');
            logger.info('Token Cache file created ' + cFile);
        } catch (error) {
            logger.error(
                'Unable to access token cache file ' + cFile + '- exiting');
            logger.error(
                'Does the directory supposed to hold the token file exist?');
            return false;
        }
    }

    return true;

}

function isConfigOk() {

    if (__.isUndefined(tenantId)) {
      logger.error('Config: Missing Tenant_Id in config');
      return false;
    }

    if (__.isUndefined(msalConfig.authOptions.clientId)) {
        logger.error('Config: Missing Client_Id in config');
        return false;
    }

    if (__.isUndefined(msalConfig.authOptions.clientSecret)) {
        logger.error('Config: Missing Client_Secret in config');
        return false;
    }

    if (__.isUndefined(msalConfig.cache.file)) {
        logger.error('Config: Missing cache file in config');
        return false;
    } else {

        if (!handleTokeCacheFile(msalConfig.cache.file)) return false;
    }

    return true;
}

function exitHandler() {
 process.exit(1);
}

//Checking config and exiting app if not ok
//The exit is a bit brutal - but no need for a more controlled exit as this stage
logger.warn('Verifying configuration for NODE_ENV ' + process.env.NODE_ENV);

if (!isConfigOk()) {
    logger.error('Invalid configuration - exiting in full panic mode');
    exitHandler();
};

module.exports = {
    tenantId,
    msalConfig,
    isConfigOk,
    port,
    host,
    gotEpisodesApiUrl: gotEpisodesApiUrl,
    handleTokeCacheFile
};
