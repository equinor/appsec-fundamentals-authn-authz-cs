var __ = require('underscore');

//Pino loglevels - https://github.com/pinojs/pino/blob/master/docs/api.md#logger-level
function loglevel() {

    if (!__.has(process.env,'NODE_ENV')) {
        return {
                server: 'warn',
            };
    };

    switch (process.env.NODE_ENV) {
        case 'production':
            return {
                server: 'warn',
            };
        case 'development':
            return {
                server: 'debug',
            };
        default:
            return {
                server: 'warn',
            };
    }

};

const logger = require('pino')({
    name: 'API',
    level: loglevel().server
});

module.exports = {logger,loglevel};
