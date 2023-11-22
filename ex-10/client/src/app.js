'use strict';

const fastify = require('fastify');
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');
const path = require('path');
var __ = require('underscore');

const appConfig = require('../lib/app-config.js');
const authUtils = require('../lib/auth-utils.js');
const logger = require('../lib/logger.js').logger;

function build(opts = {}) {
    const app = fastify(opts);

    //Plumbing modules for the web-engine, Fastify

    logger.info('Initial server plumbing');

    //Decorating for end-point protection
    app.decorate('isAuthenticated', function (request, reply, done) {
        if (authUtils.isAuthenticated(request)) {
            return done();
        } else {
            // return done(new Error('Not authenticated'));
            reply.redirect('/');
        }
    });

    //Add support for security headers - CSP
    //developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy

    var cspConfig = {};

    cspConfig = {
        useDefaults: false,
        directives: {
            'default-src': ["'self'"], // 'none' - would trigger errors in FF
            'child-src': ["'self'"],
            'connect-src': ["'self'"],
            'font-src': ["'self'"],
            'frame-src': ["'self'"],
            'img-src': ["'self'"],
            'manifest-src': ["'self'"],
            'media-src': ["'self'"],
            'object-src': ["'self'"],
            // 'prefetch-src': ["'self'"], //Not supported by FF
            'script-src': ["'self'"],
            // 'script-src-elem': ["'self'"], //Not supported by FF
            // 'script-src-attr': ["'self'"], // Not supported by FF
            'style-src': ["'self'"],
            // 'style-src-elem': ["'self'"], //Not supported by FF
            // 'style-src-attr': ["'self'"], //Not supported by FF
            'worker-src': ["'self'"],
            'base-uri': ["'none'"],
            'block-all-mixed-content': [],
            'upgrade-insecure-requests': [],
        },
    };


    //    //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src
    https: app.register(require('@fastify/helmet'), {
        global: true,    //Apply to all routes
        hsts: false,    //Disable hsts headers
        contentSecurityPolicy: cspConfig,
    });

    //Installing support for CORS headers
    //developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    //Our app is super simples and does not use XMLHttpRequest/Fetch in the browser, so anything should work ... for now.
    https: app.register(require('@fastify/cors'), {
        origin: 'https://localhost:3000',
    });

    app.register(require('@fastify/auth'));
    app.register(fastifyCookie);

    var sessionCookieConfig = {
        secure: true,
        sameSite: 'Lax',
        maxAge: 86400000,
        httpOnly: true,
    };

    app.register(fastifySession, {
        cookieName: 'sessionID',
        secret: authUtils.generateRandomKey(32),
        cookie: sessionCookieConfig,
        expire: 1800000,
    });

    app.register(require('@fastify/static'), {
        root: path.join(__dirname, '../public'),
        prefix: '/public',
        list: false,
    });

    //Rigging the template rendering system - handlebars
    var handlebars = require('handlebars');

    app.register(require('@fastify/view'), {
        engine: {
            handlebars: handlebars,
        },
        layout: './view/layouts/main.hbs',
    });

    //handlebar helper to evaluate if a value is defined or not
    handlebars.registerHelper('isdefined', function (value) {
        if (__.isUndefined(value)) {
            return false;
        } else {
            return true;
        }
    });

    app.register(require('@fastify/formbody'));

    app.register(require('fastify-favicon'), {
        path: './public',
        name: 'favicon.ico',
    });

    //Adding route handlers
    logger.info('Adding route handlers');

    app.get('/', async function (request, reply) {
        if (!__.isUndefined(request.session.homeAccountId)) {
            const accountName = await authUtils.getAccountName(
                request.session.homeAccountId
            );

            return reply.code(200).view('/view/index.hbs', {
                title: 'List my inbox',
                ShowLogoutButton: true,
                ShowLoginButton: false,
                accountName: accountName,
            });
        } else {
            return reply.code(200).view('/view/login.hbs', {
                title: 'List my inbox',
                ShowLoginButton: true,
            });
        }
    });

    app.get('/login', async function (request, reply) {
        await authUtils.getTokenAuthCode(request, reply);
    });

    app.get('/logout', async function (request, reply) {
        if (authUtils.isAuthenticated(request)) {
            await authUtils.logoutSessionUser(request, reply);
            reply.redirect('/');
        } else {
            return reply.code(403).view('/view/login.hbs', {
                title: 'List my inbox',
                ShowLoginButton: true,
            });
        }
    });

    app.get(
        '/showinbox',
        { preValidation: app.isAuthenticated },
        async function (request, reply) {
            const scopes = appConfig.msalConfig.scopes.inbox;
            const accessToken = await authUtils.getTokenSilently(
                scopes,
                request,
                reply
            );

            const accountName = await authUtils.getAccountName(
                request.session.homeAccountId
            );

            logger.debug('AccountName: ' + JSON.stringify(accountName));

            if (__.size(accessToken) > 0) {
                const inbox = await authUtils.readInbox(accessToken);
                logger.debug('Inbox : ' + inbox);

                return reply.code(200).view('/view/index.hbs', {
                    title: 'List my inbox',
                    inbox: inbox,
                    accountName: accountName,
                    ShowLogoutButton: true,
                    ShowLoginButton: false,
                });
            } else {
                return reply.code(200).view('/view/index.hbs', {
                    title: 'List my inbox',
                    inbox: 'Unable to read inbox',
                    ShowLogoutButton: true,
                    ShowLoginButton: false,
                });
            }
        }
    );

    app.get(
        '/got',
        { preValidation: app.isAuthenticated },

        async function (request, reply) {
            const scopes = appConfig.msalConfig.scopes.gotApi;

            const accessToken = await authUtils.getTokenSilently(
                scopes,
                request,
                reply
            );

            var gotEpisodes = require('../lib/gotepisodes');
            const episodes = await gotEpisodes.getGOTepisodes(accessToken);

            return reply.code(200).view('/view/index.hbs', {
                title: 'Got Episodes',
                inbox: episodes,
                ShowLogoutButton: true,
                ShowLoginButton: false,
            });
        }
    );

    //Callback endpoint for authentication (Get)
    //Request access_token and then read the email inbox
    app.get('/callback', async function (request, reply) {
        logger.debug(
            'Received auth Code from GET /callback: ' + request.query.code
        );

        var accessToken = await authUtils.requestAccessTokenUsingAuthCode(
            request,
            reply,
            request.query.code
        );

        if (__.size(accessToken) > 0) {
            logger.debug('Access token received, cache updated');

            reply.redirect('/');
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
            request,
            reply,
            request.body.code
        );

        if (__.size(accessToken) > 0) {
            logger.debug('Access token received, cache updated');
            reply.redirect('/');
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
