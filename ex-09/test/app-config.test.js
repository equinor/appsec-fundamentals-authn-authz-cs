'use strict';

const { test, notOk } = require('tap');
var sinon = require('sinon');

test('Environment Config should be persisted', (t) => {

    //Defining config
    process.env.TENANT_ID = 'A';
    process.env.CLIENT_ID = 'B';
    process.env.CLIENT_SECRET = 'C';
    process.env.REDIRECT_URI = 'D';

    delete require.cache[require.resolve('../lib/app-config.js')];
    const appConfig = require('../lib/app-config.js');

    t.equal(appConfig.tenantId, 'A', 'Tenant ID should be set');
    t.equal(appConfig.msalConfig.authOptions.clientId, 'B', 'Client ID should be set');
    t.equal(
        appConfig.msalConfig.authOptions.clientSecret,
        'C',
        'Client Secret should be set'
    );

    t.end();
});

test('IsConfigOk', (t) => {
  
    t.beforeEach(function () {
        //Defining config
        process.env.TENANT_ID = 'A';
        process.env.CLIENT_ID = 'B';
        process.env.CLIENT_SECRET = 'C';

        sinon.stub(process, 'exit');
        process.exit.callsFake(() => {
            console.log('Test triggered process.exit');
            return true;
        });   
    });

    t.afterEach(function() {
        process.exit.restore();
    });

    t.test('Base case - all config is good', (t) => {
    
        
        delete require.cache[require.resolve('../lib/app-config.js')];
        const appConfig = require('../lib/app-config.js');
     
        t.ok(appConfig.isConfigOk(), 'Config should be ok');

        t.end();
    });


    t.test('Missing TENANT_ID', (t) => {
        delete process.env.TENANT_ID;
   
        delete require.cache[require.resolve('../lib/app-config.js')];
        const appConfig = require('../lib/app-config.js');

        t.notOk(process.env.TENANT_ID, 'No TENANT_ID in process environment');
        t.notOk(appConfig.tenantId, 'No tenantid in config object');
        t.notOk(appConfig.isConfigOk(), 'Config should not be ok');
        t.equal(appConfig.msalConfig.authOptions.clientSecret,'C','Other config should be persisted');
        t.ok(process.exit.called,'Process exit called');
        
        t.end();
    });

    t.test('Missing CLIENT_ID', (t) => {
        delete process.env.CLIENT_ID;

        delete require.cache[require.resolve('../lib/app-config.js')];
        const appConfig = require('../lib/app-config.js');

        t.notOk(process.env.CLIENT_ID, 'No CLIENT_ID in process environment');
        t.notOk(appConfig.msalConfig.authOptions.clientId, 'No client_id in config object');
        t.notOk(appConfig.isConfigOk(), 'Config should not be ok');
        t.equal(
            appConfig.tenantId,
            'A',
            'Other config should be persisted'
        );
        t.ok(process.exit.called, 'Process exit called');
   
        t.end();
    });

    t.test('Missing CLIENT_SECRET', (t) => {
        delete process.env.CLIENT_SECRET;

        delete require.cache[require.resolve('../lib/app-config.js')];
        const appConfig = require('../lib/app-config.js');

        t.notOk(process.env.CLIENT_SECRET, 'No CLIENT_SECRETin process environment');
        t.notOk(appConfig.msalConfig.authOptions.clientSecret, 'No client_secret in config object');
        t.notOk(appConfig.isConfigOk(), 'Config should not be ok');
        t.equal(
            appConfig.msalConfig.authOptions.clientId,
            'B',
            'Other config should be persisted'
        );
        t.ok(process.exit.called, 'Process exit called');

        t.end();
    });

    t.test('Missing REDIRECT_URI', (t) => {
        delete process.env.REDIRECT_URI;

        delete require.cache[require.resolve('../lib/app-config.js')];
        const appConfig = require('../lib/app-config.js');

        t.notOk(process.env.REDIRECT_URI, 'No REDIRECT_URI in process environment');
        t.notOk(appConfig.msalConfig.authOptions.redirectUri, 'No redirectUri in config object');
        t.notOk(appConfig.isConfigOk(), 'Config should not be ok');
        t.equal(
            appConfig.msalConfig.authOptions.clientId,
            'B',
            'Other config should be persisted'
        );
        t.ok(process.exit.called, 'Process exit called');

        t.end();
    });

    t.end();
});

test('Set proper PORT value', (t) => {

    t.beforeEach(function () {
        //Defining config
        process.env.TENANT_ID = 'A';
        process.env.CLIENT_ID = 'B';
        process.env.CLIENT_SECRET = 'C';
        process.env.REDIRECT_URI = 'D';

        sinon.stub(process, 'exit');
        process.exit.callsFake(() => {
            console.log('Test triggered process.exit');
            return true;
        });   
    });

    t.afterEach(function() {
        process.exit.restore();
    });

    t.test('Env PORT does not exist', (t) => {
       
        delete require.cache[require.resolve('../lib/app-config.js')];

        delete process.env.PORT;

        const port = require('../lib/app-config.js').port;

        t.equal(port, '3000', 'No env PORT default to value 3000');

        t.end();
    });

    t.test('Env PORT is set', (t) => {
        delete require.cache[require.resolve('../lib/app-config.js')];

        process.env.PORT = "5999";

        const port = require('../lib/app-config.js').port;

        t.equal(port, '5999', 'PORT is given value from env PORT');

        t.end();
    });

   
    t.end();
});