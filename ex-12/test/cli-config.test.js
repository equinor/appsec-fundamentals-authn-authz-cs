'use strict';

const { test } = require('tap');
var sinon = require('sinon');
const __ = require('underscore');

test('Environment variables is used in config', (t) => {


    t.beforeEach( () => {
        delete require.cache[require.resolve('../lib/cli-config.js')];
        delete process.env.TENANT_ID;
        delete process.env.CLIENT_ID;
        delete process.env.TOKEN_CACHE_FILE

        sinon.stub(process, 'exit');

        process.exit.callsFake(() => {
            console.log('Test triggered process.exit');
            return true;
        });

    });

    t.afterEach( () => {
        process.exit.restore();
    });
    
    t.test('Environment vars should be included in config', (t) => {
        //Defining config
        process.env.TENANT_ID = 'TENANT-A';
        process.env.CLIENT_ID = 'CLIENT-B';
        process.env.TOKEN_CACHE_FILE = './test/cache.json';

        const { config } = require('../lib/cli-config.js');

        t.equal(
            config.authOptions.clientId,
            'CLIENT-B',
            'Client ID should be CLIENT-B'
        );
        t.ok(
            config.authOptions.authority.includes('TENANT-A'),
            'Authority should contain TENANT-A'
        );

        t.end();
    });


    t.test('No TENANT_ID in Environment should terminate CLI', (t) => {
        //Defining config
        process.env.CLIENT_ID = 'CLIENT-B';
        const { config } = require('../lib/cli-config.js');

        t.ok(process.exit.called, 'Process exit called');
        t.end();
    });

    t.test('No CLIENT_ID in Environment should terminate CLI', (t) => {
        //Defining config
        process.env.TENANT_ID = 'TENANT-A';
        const { config } = require('../lib/cli-config.js');

        t.ok(process.exit.called, 'Process exit called');
        t.end();
    });

    t.test('No TOKEN_CACHE_FILE in Environment should terminate CLI', (t) => {
        //Defining config
        process.env.TENANT_ID = 'TENANT-A';
        process.env.CLIENT_ID = 'CLIENT-B';
        delete process.env.TOKEN_CACHE_FILE;
        
        const { config } = require('../lib/cli-config.js');

        t.ok(process.exit.called, 'Process exit called');
        t.end();
    });


 t.end();

});


test('Config should contain required objects', (t) => {
    t.beforeEach(() => {

        delete require.cache[require.resolve('../lib/cli-config.js')];
        process.env.TENANT_ID = 'TENANT-A';
        process.env.CLIENT_ID = 'CLIENT-B';
        process.env.TOKEN_CACHE_FILE = './test/cache.json';

        sinon.stub(process, 'exit');

        process.exit.callsFake(() => {
            console.log('Test triggered process.exit');
            return true;
        });
    });

    t.afterEach(() => {
        process.exit.restore();
    });

    t.test('MSAL client config contains needed objects', (t) => {
      

        const { msalClientConfig } = require('../lib/cli-config.js');

        sinon.spy(msalClientConfig.system.loggerOptions,'loggerCallback');
        msalClientConfig.system.loggerOptions.loggerCallback(0,'a log message, false');

        t.ok(__.has(msalClientConfig,'auth'), 'should contain auth object')
        t.ok(__.has(msalClientConfig, 'cache'), 'should contain cache object');
        t.ok(__.has(msalClientConfig, 'system'), 'should contain system object');

        t.ok(msalClientConfig.system.loggerOptions.loggerCallback.calledOnce, 'The msal client logger callback should be called');


        t.end();
    });


    t.end();
});


