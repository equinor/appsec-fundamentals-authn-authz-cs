/*
A module for getting quotes using the quotes api.
Strategy

- Use the O-B-O flow to get an access token for the quotes api
- Hit the quotes api with the access token and get a quote

*/

const { logger } = require('../lib/logger.js');
const appConfig = require('./app-config.js');

//The assertion param is the accesstoken we use in the assertion field when using the bob flow
async function getAccessToken(assertion) {
    logger.debug('Trying use exchange token for a new token using O-B-O');

    //Build the form for the AT request using o-b-o
    let requestForm = {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        client_id: appConfig.clientId,
        client_secret: appConfig.clientSecret,
        assertion: assertion,
        scope: appConfig.quoteApiScope, //The scope we request for the Quote Api
        requested_token_use: 'on_behalf_of',
    };

    const url = 'https://login.microsoftonline.com/' + appConfig.tenantId + '/oauth2/v2.0/token'

    const got = (await import('got')).default;

    try {
        const response = await got.post(url, {form: requestForm }).json();

        logger.debug('Got new access token for quote api');
      
        return response.access_token;
    
    } catch (error) {
        logger.error('Error getting AT for Quote API :: ' + error);
        return '';
    }
}

async function getQuote(assertion) {
  
    const accessToken = await getAccessToken(assertion);
   
    const got = (await import('got')).default;
   
    try {
        const response = await got.get(appConfig.quoteApiUrl, {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });
    
        return response.body;

    } catch (error) {
        logger.error('Error getting Quote :: ' + error);
        return JSON.stringify({title: 'Quote Error'});
    }
}

module.exports = { getQuote };
