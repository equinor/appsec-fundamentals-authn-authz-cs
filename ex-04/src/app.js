'use strict';

const fastify = require('fastify');
const path = require('path');
var __ = require('underscore');


// const appConfig = require('./app-config.js'); //Loading config, will exit if config not ok
const authUtils = require('../lib/auth-utils.js');
const logger = require('../lib/logger.js').logger;


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
     
        await authUtils.getTokenAuthCode(request, reply);
        
    });

    //Callback endpoint for authentication (Get)
    //Request access_token and then read the email inbox
    app.get('/callback', async function (request, reply) {
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
    //Request access_token and then read the email inbox
    app.post('/callback', async function (request, reply) {
        

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
     
module.exports = { build };
