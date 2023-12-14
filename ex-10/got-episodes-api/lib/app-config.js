'use strict';

var __ = require('underscore');
const logger = require('./logger.js').logger;

// Configuration Objects
logger.info('Building configuration');

const tenantId = process.env.TENANT_ID;
const port = (process.env.PORT || '3100' );
const host = process.env.HOST || 'localhost';
const swaggerHost = process.env.SWAGGER_HOST || host + ':' + port;

const jwksUri = 'https://login.microsoftonline.com/' + tenantId + '/discovery/v2.0/keys';
const apiAudience = 'api://f6a763f4-932d-4784-8122-f2b526bb2364';

const rateLimitAllowList = function () {
    return ['127.0.0.1','::1'];
};

const maxRateLimit = function () {
    return 10;
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

    return true;

};

function exitHandler() {
 process.exit(1);
}

//Checking config and exiting app if not ok
//The exit is a bit brutal - but no need for a more controlled exit as this stage
logger.info('Verifying configuration');

if (!isConfigOk()) {
    logger.error('Invalid configuration - exiting in full panic mode');
    exitHandler();
};

module.exports = {
    port,
    host,
    swaggerHost,
    jwksUri,
    tenantId,
    apiAudience,
    rateLimitAllowList,
    maxRateLimit
};

