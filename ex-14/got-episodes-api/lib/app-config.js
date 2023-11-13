'use strict';

var __ = require('underscore');
const logger = require('./logger.js').logger;

// Configuration Objects
logger.info('Building configuration');

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;


const port = (process.env.PORT || '3000' );
const host = process.env.HOST || 'localhost';

const jwksUri = 'https://login.microsoftonline.com/' + tenantId + '/discovery/v2.0/keys';
const apiAudience = 'api://' + process.env.EPISODES_API_URI;
const quoteApiUrl = process.env.QUOTES_API_URL + '/api/quote';
const quoteApiScope = 'api://' + process.env.QUOTES_API_URI + '/quote.read';


const rateLimitAllowList = function () {
    return ['127.0.0.1', 'localhost', '::1'];
};

const maxRateLimit = function () {
    return 100;
};

function isConfigOk() {
    
    if (__.isUndefined(jwksUri)) {
        logger.error('Config: Missing jwksUri in config');
        return false;
    }

    if (__.isUndefined(tenantId)) {
        logger.error('Config: Missing tenantId in config');
        return false;
    }

    if (__.isUndefined(apiAudience)) {
        logger.error('Config: Missing apiAudience in config');
        return false;
    }

    if (__.isUndefined(clientId)) {
        logger.error('Config: Missing client Id in config');
        return false;
    }

    if (__.isUndefined(clientSecret)) {
        logger.error('Config: Missing client secret in config');
        return false;
    }

    if (__.isUndefined(process.env.EPISODES_API_URI)) {
        logger.error('Config: Missing URI for Episodes API');
        return false;
    }

    if (__.isUndefined(quoteApiUrl)) {
        logger.error('Config: Missing URL for Episodes API');
        return false;
    }

    return true;

}

function exitHandler() {
    process.exit(1);
}

//Checking config and exiting app if not ok
//The exit is a bit brutal - but no need for a more controlled exit as this stage
logger.info('Verifying configuration');

if (!isConfigOk()) {
    logger.error('Invalid configuration - exiting in full panic mode');
    exitHandler();
}

module.exports = {
    port,
    host,
    jwksUri,
    tenantId,
    apiAudience,
    rateLimitAllowList,
    maxRateLimit,
    clientId,
    clientSecret,
    quoteApiUrl,
    quoteApiScope
};

