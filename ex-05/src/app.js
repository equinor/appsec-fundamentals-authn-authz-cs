'use strict';

const fastify = require('fastify');
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');
const path = require('path');
var __ = require('underscore');


// const appConfig = require('./app-config.js'); //Loading config, will exit if config not ok
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
            reply.redirect('/');
            // return done(new Error('Not authenticated'));
        }
    });

    app.register(require('@fastify/auth'));
    app.register(fastifyCookie);
    app.register(fastifySession, {
        cookieName: 'sessionID',
        secret: authUtils.generateRandomKey(32),
        cookie: {
            secure: 'auto',
            sameSite: 'Lax',
            maxAge: 86400000,
            httpOnly: true,
        }
    });


    // //Tentative logging of session information
    // app.addHook('preHandler', (request, reply, next) => {

    //     logger.debug(
    //         'Current request/sessionId/#sessions : ' +
    //             request.id + ' -> ' +
    //             request.session.sessionId +
    //             ' (' +
    //             request.sessionStore.store.size + ')'
    //     );

    //     next();
    // })

    app.register(require('@fastify/static'), {
        root: path.join(__dirname, '../public'),
        prefix: '/public',
        list: false,
        httpOnly: true,
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
            return false 
        }
        else {
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
        
          var ShowWriterButton = false;

          if (!__.isUndefined(request.session.homeAccountId)) {

           const accountName = await authUtils.getAccountName(
               request.session.homeAccountId
           );

           const accountAppRoles = await authUtils.getAccountAppRoles(
               request.session.homeAccountId
           );

           if (__.indexOf(accountAppRoles,'app.write') > -1) {
            ShowWriterButton = true;
           } 

           return reply.code(200).view('/view/index.hbs', {
               title: 'List my inbox',
               ShowLogoutButton: true,
               ShowLoginButton: false,
               ShowWriterButton: ShowWriterButton,
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
            await authUtils.logoutSessionUser(request,reply);
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

            const accessToken = await authUtils.getTokenSilently(
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

            logger.debug('Access token received, cache updated')  
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
