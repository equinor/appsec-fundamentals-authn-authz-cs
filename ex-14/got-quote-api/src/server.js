'use strict';

const { logger } = require('../lib/logger.js');
const { port, host } = require('../lib/app-config');

const loglevel = require('../lib/logger.js').loglevel().server;

logger.info('Server loglevel: ' + loglevel);

const fastifyConf = {
    port: port,
    host: host,
};

const start = async () => {
    const server = await require('../src/app').build({
        logger: {
            level: loglevel,
            name: 'Quotes API Server',
        },
        port: port,
    });

    try {
        await server.listen(fastifyConf);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
