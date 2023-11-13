'use strict';

const { logger } = require('../lib/logger.js');

const { port, host } = require('../lib/app-config');

const loglevel = require('../lib/logger.js').loglevel().server;

logger.info('Server loglevel: ' + loglevel);

//Instansiating server using fastify, passing the fastify config object as param.
const server = require('../src/app').build({
    logger: {
        level: loglevel,
        name: 'Server'
    },
    port: port
});

const fastifyConf = {
    port: port,
    host: host,
};

server
    .listen(fastifyConf)
    // .then((address) => console.log(`Server is listening on ${address}`))
    .catch((err) => {
        console.log('Error starting server:', err);
        process.exit(1);
    });

