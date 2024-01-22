'use strict';

const fastify = require('fastify');
const path = require('path');
var __ = require('underscore');
var randomString = require('random-string')

const authUtils = require('../lib/auth-utils.js');
const logger = require('../lib/logger.js').logger;

// Global parameter to generate state for request to the authorize end-point
var state = null;

function build(opts = {}) {
    const app = fastify(opts);

    //Plumbing modules for the web-engine, Fastify

    logger.info('Initial server plumbing');
    app.register(require('@fastify/static'), {
        root: path.join(__dirname, '../public'),
        prefix: '/public',
        list: false,
    });

    app.register(require('@fastify/view'), {
        engine: {
            handlebars: require('handlebars'),
        },
        layout: './view/layouts/main.hbs',
    });

    app.register(require('@fastify/formbody'));

    app.register(require('fastify-favicon'), {
        path: './public',
        name: 'favicon.ico',
    });

    //Adding route handlers
    logger.info('Adding route handlers');

    app.get('/', async function (request, reply) {
        return reply.code(200).view('/view/index.hbs', {
            title: 'List my inbox',
        });
    });

    app.get('/showinbox', async function (request, reply) {
        state = createNewState();
        const response_mode = 'query';  //recommended, default from the MS Identity platform
        const scope = 'user.read mail.read';

        return reply.redirect(
            302,
            authUtils.buildAuthorizeUrl(state, scope, response_mode)
        );
    });

    //Callback endpoint for authentication (Get)
    //Verify return value, request access_token and then read the email inbox
    app.get('/callback', async function (request, reply) {

        if (!__.has(request.query, 'code')) {
            logger.error('No auth code in request');
            return reply.code(400).send('Error in request');
        }

        if (!__.has(request.query, 'state')) {
            logger.error('No STATE in request');
            return reply.code(400).send('Error in request');
        }

        if (!__.isEqual(request.query.state, state)) {
            logger.error('Wrong STATE in request');
            return reply.code(400).send('Error in request');
        }

        logger.debug(
            'Received auth Code from GET /callback: ' + request.query.code
        );

        var accessToken = await authUtils.requestAccessTokenUsingAuthCode(
            request.query.code
        );

        if (__.size(accessToken) > 0) {

            var inbox = await authUtils.readInbox(accessToken);

            logger.debug('Inbox : ' + inbox);

            return reply.code(200).view('/view/index.hbs', {
                title: 'List my inbox',
                inbox: inbox,
            });
        } else {
            logger.error('No access token in response body');
            return reply
                .code(400)
                .send('No access_token in response from token endpoint');
        }
    });

    //Callback endpoint for authentication (Post)
    //Verify return value, request access_token and then read the email inbox
    app.post('/callback', async function (request, reply) {
        if (!__.has(request.body, 'code')) {
            logger.error('No auth code in request');
            return reply.code(400).send('Error in request');
        }

        if (!__.has(request.body, 'state')) {
            logger.error('No STATE in request');
            return reply.code(400).send('Error in request');
        }

        if (!__.isEqual(request.body.state, state)) {
            logger.error('Wrong STATE in request');
            return reply.code(400).send('Error in request');
        }

        logger.debug('Auth Code from POST to /callback: ' + request.body.code);

        var accessToken = await authUtils.requestAccessTokenUsingAuthCode(
            request.body.code
        );

        if (__.size(accessToken) > 0) {

            var inbox = await authUtils.readInbox(accessToken);

            logger.debug('Inbox : ' + inbox);

            return reply.code(200).view('/view/index.hbs', {
                title: 'List my inbox',
                inbox: inbox,
            });
        } else {
            logger.error('No access token in response body');
            return reply
                .code(400)
                .send('No access_token in response from token endpoint');
        }
    });

    return app;
}
     
function createNewState() {
    return randomString({ length: 32, special: false });
};

function returnState() {
    return state;
}

module.exports = { build, returnState };
