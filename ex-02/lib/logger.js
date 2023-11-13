var __ = require('underscore');

//Pino loglevels - https://github.com/pinojs/pino/blob/master/docs/api.md#logger-level
function loglevel() {

    if (!__.has(process.env,'NODE_ENV')) {
        return 'error'
    };

    switch (process.env.NODE_ENV) {
        case 'production':
            return 'error';
        case 'development':
            return 'debug';
        default:
            return 'error'
    }

};

const logger = require('pino')({
    name: 'AppLogger',
    level: loglevel(),
});

module.exports = {logger,loglevel};
