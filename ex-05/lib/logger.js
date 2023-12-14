var __ = require('underscore');

//Pino loglevels - https://github.com/pinojs/pino/blob/master/docs/api.md#logger-level
function loglevel() {

    if (!__.has(process.env,'NODE_ENV')) {
        return {
                server: 'error',
                msal: 0, //error
            };
    };

    switch (process.env.NODE_ENV) {
        case 'production':
            return {
                server: 'warn',
                msal: 1, //warning
            };
        case 'development':
            return {
                server: 'debug',
                msal: 3,  //verbose
            };
        default:
            return {
                server: 'error',
                msal: 0, //error
            };
    }

};

const logger = require('pino')({
    name: 'AppLogger',
    level: loglevel().server
});

module.exports = {logger,loglevel};
