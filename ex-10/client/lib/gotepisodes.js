'use strict'

const logger = require('./logger.js').logger;
const got = require('got');  // https://github.com/sindresorhus/got
const authUtils = require('../lib/auth-utils.js');
var __ = require('underscore');
const appConfig = require('./app-config.js'); 


//Using access token to read got episodes
async function getGOTepisodes(accessToken) {
    var episodes = [];

    var requestHeaders = {
        'user-agent': authUtils.clientUserAgent(),
        Authorization: 'Bearer ' + accessToken,
    };

    try {
        logger.debug('Preparing to read GOT api ...');
        
        const url = appConfig.gotApiUrl + '/api/episodes';
        const response = await got.get(
            url,
            {
                headers: requestHeaders,
                retry: 0   //Number of retries in case of error - including ratelimiting
            }
        );
   

        var episodesBody = JSON.parse(response.body);
 
        __.each(episodesBody, function (item, index) {
            episodes.push(item.id + ' - ' + item.title);
        });

        logger.debug('Returning response from GOT API:: '+ episodes);

        return episodes;
   
    } catch (error) {
        
        logger.error('Request for GOT episodes: ' + error);
        episodes.push('Unable to retrieve GOT Episodes')

        return episodes;
    }
}


module.exports = {getGOTepisodes};