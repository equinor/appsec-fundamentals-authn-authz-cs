'use strict'

let jwt = require('jsonwebtoken');
let __ = require('underscore');
const { logger } = require('../lib/logger.js');
const appConfig = require('./app-config.js');
const createError = require('http-errors');

//Adding auth validator
async function authVerify(request, reply) {
    let tokenArray = [];

    logger.info(
        'Authenticating request for API ' + request.method + ' ' + request.url
    );

    //Verify if request contains an authorization header
    if (request.headers.authorization) {
        tokenArray = request.headers.authorization.split(' ');
    } else {
        logger.error('No Auth header in request');
        throw createError(401, 'Unauthorized - missing authentication');
    }

    //Decoding token
    let decodedToken = jwt.decode(tokenArray[1], { complete: true });
    let token = tokenArray[1];

    if (__.isNull(decodedToken)) {
        logger.error('Unable to decode token: ' + tokenArray[1]);
        throw createError(400, 'Unauthorized - bad request');
    }

    logger.debug(
        'Decoded token header: ' + JSON.stringify(decodedToken.header)
    );

    //Verifying key parts of access token header
    if (__.isUndefined(decodedToken.header.kid)) {
        logger.error('Token header is missing KID');
        throw createError(400, 'Unauthorized - bad request');
    }

    //Building up objects where the end-goal is to verify the token
    //Get signing key, define options to validate and then verify

    let jwksClient = require('jwks-rsa');
    let client = jwksClient({
        jwksUri: appConfig.jwksUri,
    });

    let kid, key, signingKey;

    //Consult library doc for verification options
    //https://github.com/auth0/node-jsonwebtoken#readme
    let validateOptions = {
        audience: appConfig.apiAudience, //Who is this token for? This API (ad object ID URI)
        issuer: 'https://sts.windows.net/' + appConfig.tenantId + '/', //Which MS tenant issued the token
        maxAge: '90m',  // May not be necessary, but could be a signal on something being off or have changed
        algorithms: 'RS256',
    };
   
    try {
        kid = decodedToken.header.kid;
        key = await client.getSigningKey(kid);
        signingKey = key.getPublicKey();

        if (signingKey.length <= 0) {
            throw new Error('Empty signing key - would trigger alg=none');
        }
    } catch (err) {
        logger.error(err.name + ' - ' + err.message);
        throw createError(400, 'Unauthorized - bad request');
    }

    jwt.verify(token, signingKey, validateOptions, async function (err, decoded) {
        if (!err) {
            logger.debug('Decoded token body: ' + JSON.stringify(decoded));


            //Decoded object could be passed on to drive further CRUD logic logic
            if (!await grantScopeToRoute(decoded.scp, request.method, request.url)) {
                logger.error(err);
                throw createError(403, 'Forbidden');
            }

            //Potentially more logic

       
        } else {
            logger.error(err.name + ' - ' + err.message);
            throw createError(401, 'Unauthorized');
        }
    });
};


// A function to determine if access to route should be granted 
// based on scope claim from an access token
//
// Only doing a few scenarios (GET, READ)
async function grantScopeToRoute(scope, method, url) {

    //Default deny is a good practice
    let grantAccess = false;

    logger.debug('Processing scope ' + scope + ' for access to ' + url + ' using method ' + method);

    switch(method) {
        case 'GET':
            if (scope.match(/episodes.read/i)) {
                grantAccess = true;
            }
            break;

        case 'DELETE':
            if (scope.match(/episodes.delete/i)) {
                grantAccess = true;
            }
            break;
    }
    
       
    logger.info('Access granted? ' + grantAccess);
    return grantAccess;

}

module.exports = {authVerify};