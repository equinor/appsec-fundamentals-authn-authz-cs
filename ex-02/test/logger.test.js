'use strict';

const { test } = require('tap');

test('NODE_ENV should trigger proper log level', async (t) => {


    t.test('No NODE_ENV', (t) => {

        delete process.env.NODE_ENV

        const loglevel = require('../lib/logger.js').loglevel();

        t.equal(loglevel,'error','Empty NODE_ENV sets loglevel error');

        t.end();
    });

    t.test('NODE_ENV=production', (t) => {
        delete process.env.NODE_ENV;
        process.env.NODE_ENV = 'production'

        const loglevel = require('../lib/logger.js').loglevel();

        t.equal(loglevel, 'error', 'NODE_ENV=production sets loglevel error');

        t.end();
    });

    t.test('NODE_ENV=development', (t) => {
        delete process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        const loglevel = require('../lib/logger.js').loglevel();

        t.equal(loglevel, 'debug', 'NODE_ENV=development sets loglevel debug');

        t.end();
    });

    t.test('NODE_ENV=not prod or dev (default)', (t) => {
        delete process.env.NODE_ENV;
        process.env.NODE_ENV = '';

        const loglevel = require('../lib/logger.js').loglevel();

        t.equal(loglevel, 'error', 'NODE_ENV=anything but dev and prod sets loglevel error');

        t.end();
    });



    t.end();
});