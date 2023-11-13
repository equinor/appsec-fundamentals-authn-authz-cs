'use strict';

const __ = require('underscore');
const { logger, loglevel } = require('./logger');
const msal = require('@azure/msal-node');



/**
 * Trying to get access token from cache using device code 
 *
 */

async function getTokenDeviceCode(config, clientApplication) {

    logger.info('Trying to get access token using device code grant');

    const runtimeOptions = { 
        deviceCodeCallback: (response) => console.log(response.message)
    };

    const deviceCodeRequest = {
    ...config.request.deviceCodeUrlParameters,
    deviceCodeCallback: runtimeOptions.deviceCodeCallback
    };

    
    return clientApplication.acquireTokenByDeviceCode(deviceCodeRequest)
        .then((response) => {
            logger.info('Got access token using device code grant');
            return response.accessToken;
        })
        .catch((error) => {
            logger.info('Unable to get access token using device code grant - error follows');
            logger.info(error);
            return '';
        });
}


/**
 * Trying to get access token from cache using a silent request
 * The silent request should also try to use the refresh token
 * to get a new accesstoken of not valid.
 * 
 * Assuming only one account in the cache.
 */

async function getTokenSilently(config, clientApplication) {
    var accessToken = '';
    var accounts = [];

    logger.info('Trying to get access token silently');
  
    const msalTokenCache = await clientApplication.getTokenCache();

    accounts = await msalTokenCache.getAllAccounts();

    if (accounts.length > 0) {
        logger.info('Aquired token cache and found account');

        const account = accounts[0];

        const silentRequest = {
            ...config.request.deviceCodeUrlParameters,
            account: account,
        };

        await clientApplication
            .acquireTokenSilent(silentRequest)
            .then((authResponse) => {
                logger.info('Aquired access token from cache')
                accessToken = authResponse.accessToken;
            })
            .catch((error) => {
                logger.info('Unable to aquire access token from cache');
                console.log(error);
            });

    } else {
        logger.info('No accounts found in cache');
    }

    return accessToken;
}


module.exports = {
    getTokenDeviceCode,
    getTokenSilently,
};