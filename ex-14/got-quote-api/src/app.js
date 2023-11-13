'use strict';

const { logger } = require('../lib/logger.js');
const fastify = require('fastify');
const rateLimitAllowList = require('../lib/app-config').rateLimitAllowList();
const maxRateLimit = require('../lib/app-config').maxRateLimit();
const port = require('../lib/app-config').port;

async function build(opts= {}) {

    const app = fastify(opts);

    logger.info('Initial api server plumbing');

    //Installing support for CORS headers
    await app.register(require('@fastify/cors'),{
        origin: '*',
    });

    //Registering a api rate limiter
    await app.register(require('@fastify/rate-limit'), {
        max: maxRateLimit,
        timeWindow: '1 minute',
        ban: 2,
        allowList: rateLimitAllowList
    });

    await app.register(require('@fastify/swagger'), {
        swagger: {
            info: {
                title: 'GOT Quotes Api',
                description: 'Prodly Serving Quotes from GOT',
                version: '0.6.0',
            },
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Find more info here',
            },
            host: 'localhost:' + port,
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [
                {
                    name: 'api/quote',
                    description: 'Working with GOT episodes',
                },
            ],
            securityDefinitions: {
                Bearer: {
                    type: 'apiKey',
                    name: 'Authorization:',
                    in: 'header',
                },
            },
        },
    });

    await app.register(require('@fastify/swagger-ui'), {
        routePrefix: '/doc',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false,
        },
        staticCSP: false,
        transformStaticCSP: (header) => {
            console.log(header);
            return header;
        },
        exposeRoute: true,
    });

    //Register routes
    const quoteRoutes = await require('../routes/quotes');
    quoteRoutes.forEach((route) => {
        app.route(route);
    });

    return app;

} //build

module.exports = {build};