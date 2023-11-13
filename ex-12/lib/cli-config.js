'use strict';

const { logger, loglevel } = require('./logger');
const __ = require('underscore');
const fs = require('fs');

const configFile = require(`../config/authConfig.json`);
const config = buildConfig(configFile);

const tokenCacheFile = process.env.TOKEN_CACHE_FILE;
const cachePlugin = require('./cachePlugin')(tokenCacheFile);

const loggerOptions = {
    loggerCallback(loglevel, message, containsPii) {
        logger.debug(message);
    },
    piiLoggingEnabled: false,
    logLevel: loglevel.msal,
};

const msalClientConfig = {
    auth: config.authOptions,
    cache: {
        cachePlugin,
    },
    system: {
        loggerOptions: loggerOptions,
        // proxyUrl: "http://127.0.0.1:8080"
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


//Checking and bulding the config object
function buildConfig(config) {

    //do some checking and bail out if config is missing
    if (
        __.isEmpty(process.env.CLIENT_ID) ||
        __.isEmpty(process.env.TENANT_ID) ||
        __.isEmpty(process.env.TOKEN_CACHE_FILE)
    ) {
        logger.error(
            'Missing environment config. Need CLIENT_ID, TENANT_ID and TOKEN_CACHE_FILE. Exiting in panic mode'
        );
        exitHandler();
    }

    if (!handleTokeCacheFile(process.env.TOKEN_CACHE_FILE)) {
        logger.error('Unable to create token cache file, exiting');
        exitHandler();
    };

    config.authOptions.clientId = process.env.CLIENT_ID;
    config.authOptions.authority = config.authOptions.authority + process.env.TENANT_ID;

    return config;

}

//Exit handler, created for testability (stubing)
function exitHandler() {
    process.exit(1)
}


module.exports = {
    config,
    msalClientConfig,
    tokenCacheFile
};