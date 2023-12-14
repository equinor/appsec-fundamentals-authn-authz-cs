'use strict';

const __ = require('underscore');
const logger = require('./logger.js').logger;

// Configuration Objects
logger.info('Building configuration');

const port = process.env.PORT || '3000';
const host = process.env.HOST || 'localhost';

const tenantId = process.env.TENANT_ID;

const serverConfig = {
  authorizationEndpoint: 'https://login.microsoftonline.com/' + tenantId + '/oauth2/v2.0/authorize',
  tokenEndpoint: 'https://login.microsoftonline.com/' + tenantId + '/oauth2/v2.0/token'  
};

const clientConfig = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI
};

function isConfigOk() {
    
    if (__.isUndefined(tenantId)) {
      logger.error('Config: Missing tenant_id in config');
      return false;  
    }

    if (__.isUndefined(clientConfig.client_id)) {
        logger.error('Config: Missing client_Id in config');
        return false; 
    }

    if (__.isUndefined(clientConfig.client_secret)) {
        logger.error('Config: Missing client_Secret in config');
        return false; 
    }

    if (__.isUndefined(clientConfig.redirect_uri)) {
        logger.error('Config: Missing redirect_uri in config');
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
};

module.exports = {
    tenantId,
    serverConfig,
    clientConfig,
    isConfigOk,
    port,
    host
};