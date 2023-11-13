'use strict';

const { test } = require('tap');
var __ = require('underscore');

test('NODE_ENV should trigger proper log level', async (t) => {


    t.test('No NODE_ENV', (t) => {

        delete process.env.NODE_ENV;

        const loglevel = require('../lib/logger.js').loglevel();

        t.ok(__.isEqual(loglevel,{server: 'warn'}),'Empty NODE_ENV sets loglevel warn');

        t.end();
    });

    t.test('NODE_ENV=production', (t) => {
        delete process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        const loglevel = require('../lib/logger.js').loglevel();

        t.ok(
            __.isEqual(loglevel, { server: 'warn'}),
            'NODE_ENV=production sets loglevel warn'
        );

        t.end();
    });

    t.test('NODE_ENV=development', (t) => {
        delete process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        const loglevel = require('../lib/logger.js').loglevel();

        t.ok(
            __.isEqual(loglevel, { server: 'info'}),
            'NODE_ENV=production sets loglevel info'
        );

        t.end();
    });

    t.test('NODE_ENV=not prod or dev (default)', (t) => {
        delete process.env.NODE_ENV;
        process.env.NODE_ENV = '';

        const loglevel = require('../lib/logger.js').loglevel();
        
        t.ok(
            __.isEqual(loglevel, { server: 'warn'}),
            'NODE_ENV=NODE_ENV=anything but dev and prod sets loglevel warn'
        );

        t.end();
    });

    t.end();
});