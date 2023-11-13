'use strict';

const got = require('got');
const __ = require('underscore');
const { logger, loglevel } = require('./logger');


/**
 * Get some data from a resource api
 *
 */

async function readResource(accessToken, endpoint) {

    logger.info('Preparing to hit the MS graph ' + endpoint);

    var requestHeaders = {
        'user-agent': 'who cares',
        Authorization: 'Bearer ' + accessToken,
    };

    try {
        
        const response = await got.get(endpoint, {
            headers: requestHeaders,
            retry: 1,
        });

        logger.info('Got response from ms graph');
        return JSON.parse(response.body);

    } catch (error) {
        logger.info('Request to ms graph failed, error follows');
        logger.info(error)

        return {};
    }

}


module.exports = {
    readResource
};