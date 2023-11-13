'use strict'

const msal = require('@azure/msal-node');
const { config, msalClientConfig, tokenCacheFile } = require('./cli-config.js');
const {logger, loglevel} = require('./logger');
const __ = require('underscore');
const {readResource} = require('./graph-utils.js');
const { getTokenDeviceCode, getTokenSilently } = require('./msal-utils');


/**
* Main routine for processing request
* Focus on readability rather than brilliance - using old style coding
*/


async function processRequest() {

    var success = false;
    var accessToken = '';

    //0. Process command line paramaters and decide what to do
    //   No in the scope of this example

    //1. Do we have an access token we can use?

    accessToken = await getTokenSilently(config, pca);

    //2. Check if we have an access token now
    //   If not, try to get it using device code 
    if (accessToken.length == 0) {
        accessToken = await getTokenDeviceCode(config, pca);
    };

    //3. We have a access token and can do stuff
    //   In this example we hit the ms graph /me endpoint
    if (accessToken.length > 0) {
        logger.info('Preparing to hit ME in the Microsoft Graph');
        
        const me = await readResource(accessToken, config.resourceApi.endpoint);

        if(!__.isEmpty(me)) {

             console.log('According to MS you are ' + me.displayName + ' and your mail address is ' + me.mail);
             console.log(
                 'Warning: access tokens are cached locally in ' +
                     tokenCacheFile +
                     '. Handle with care!'
             );
             success = true;

        } else {
            console.log('According to MS you are void');
        }
 
    };

    if (success) {
        logger.info('We have reason to believe that the request was processed successfully - what ever that means');
        exitHandler(0);
    } else {
        logger.info('Not able to process request successfully');
        exitHandler(1);
    }

};


//Exit handler, created for testability (stubing)
function exitHandler(errorCode) {
    process.exit(errorCode)
}


// Create an MSAL PublicClientApplication object 
const pca = new msal.PublicClientApplication(msalClientConfig);

module.exports = {
    processRequest
}