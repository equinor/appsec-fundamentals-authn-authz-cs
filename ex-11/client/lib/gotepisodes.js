'use strict'

const logger = require('./logger.js').logger;
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

        const got = (await import('got')).default;

        const url = appConfig.gotEpisodesApiUrl + '/api/episodes';
        const response = await got.get(
            url,
            {
                headers: requestHeaders,
                retry: { limit: 0},   //Number of retries in case of error - including rate limiting,
                responseType: 'json'
            }
        );


        var episodesBody = response.body;

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
