'use strict';

const { test } = require('tap');
var __ = require('underscore');

test('NODE_ENV should trigger proper log level', async (t) => {


    t.test('No NODE_ENV', (t) => {

        delete process.env.NODE_ENV

        const loglevel = require('../lib/logger.js').loglevel();

        t.ok(__.isEqual(loglevel,{server: 'error',msal: 0}),'Empty NODE_ENV sets loglevel error');

        t.end();
    });

    t.test('NODE_ENV=production', (t) => {
        delete process.env.NODE_ENV;
        process.env.NODE_ENV = 'production'

        const loglevel = require('../lib/logger.js').loglevel();

        t.ok(
            __.isEqual(loglevel, { server: 'warn', msal: 1 }),
            'NODE_ENV=production sets loglevel warn'
        );

        t.end();
    });

    t.test('NODE_ENV=development', (t) => {
        delete process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        const loglevel = require('../lib/logger.js').loglevel();

        t.ok(
            __.isEqual(loglevel, { server: 'debug', msal: 3 }),
            'NODE_ENV=production sets loglevel debug'
        );

        t.end();
    });

    t.test('NODE_ENV=not prod or dev (default)', (t) => {
        delete process.env.NODE_ENV;
        process.env.NODE_ENV = '';

        const loglevel = require('../lib/logger.js').loglevel();
        
        t.ok(
            __.isEqual(loglevel, { server: 'error', msal: 0 }),
            'NODE_ENV=NODE_ENV=anything but dev and prod sets loglevel error'
        );

        t.end();
    });

    t.end();
});