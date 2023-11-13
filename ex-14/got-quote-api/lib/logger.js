var __ = require('underscore');

//Pino loglevels - https://github.com/pinojs/pino/blob/master/docs/api.md#logger-level
function loglevel() {

    if (!__.has(process.env,'NODE_ENV')) {
        return {
            server: 'warn',
        };
    }

    switch (process.env.NODE_ENV) {
    case 'development':
        return {
            server: 'info',
        };
    case 'test':
        return {
            server: 'debug',
        };
    default:
    //default for production
        return {
            server: 'warn',
        };
    }

}

const logger = require('pino')({
    name: 'API',
    level: loglevel().server
});

module.exports = {logger,loglevel};
