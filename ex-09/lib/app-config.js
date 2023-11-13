'use strict';

const __ = require('underscore');
const logger = require('./logger.js').logger;

// Configuration Objects
logger.info('Building configuration');

const port = process.env.PORT || '3000';
const host = process.env.HOST || 'localhost';

const tenantId = process.env.TENANT_ID;

//request:  https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationurlrequest
const msalConfig = {
    authOptions: {
        clientId: process.env.CLIENT_ID,
        authority: 'https://login.microsoftonline.com/' + tenantId,
        clientSecret: process.env.CLIENT_SECRET,
    },
    request: {
        authCodeUrlParameters: {
            scopes: ['user.read mail.read'],
            redirectUri: 'http://localhost:' + port + '/callback',
            responseMode: 'query',
            // responseMode: 'form_post',
            // prompt: 'none',
        },
        tokenRequest: {
            redirectUri: 'http://localhost:' + port + '/callback',
            scopes: ['user.read mail.read'],
        },
        silentRequest: {
            scopes: ['user.read mail.read'],
        },
    },
    resourceApi: {
        endpoint: 'https://graph.microsoft.com/v1.0/me',
    },
};


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
    msalConfig,
    isConfigOk,
    port,
    host
};