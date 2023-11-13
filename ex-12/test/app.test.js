'use strict';

//Defining config
process.env.TENANT_ID = 'A';
process.env.CLIENT_ID = 'B';
process.env.TOKEN_CACHE_FILE = './test/cache.json';

const { test } = require('tap');
const sinon = require('sinon');
const msal = require('@azure/msal-node');
const graphUtils = require('../lib/graph-utils');

test('cli should process requests', async (t) => {
    
     t.beforeEach(() => {
         delete require.cache[require.resolve('../lib/app.js')];
         process.env.TENANT_ID = 'TENANT-A';
         process.env.CLIENT_ID = 'CLIENT-B';
         process.env.TOKEN_CACHE_FILE = './test/cache.json';

         sinon.stub(msal, 'PublicClientApplication'); 

         sinon.stub(process,'exit');
         process.exit.callsFake(() => {
            console.log('Test triggered process.exit');
            return true;
         });

         msal.PublicClientApplication.returns({
             
         });
     });

     t.afterEach(() => {
         msal.PublicClientApplication.restore();
         process.exit.restore();
     });

     t.test('get access token from cache and data from the MS graph', async (t) => {
         
        const msalUtils = require('../lib/msal-utils');
        
        sinon.stub(msalUtils,'getTokenSilently');
        msalUtils.getTokenSilently.returns('ey...ye')
    
        sinon.stub(graphUtils,'readResource');
        graphUtils.readResource.returns({
            displayName: 'Ola Normann',
            mail: 'ola.normann@norway.no'
        });

        const cli = await require('../lib/app.js').processRequest();
       
        t.ok(process.exit.called,'Process exit should be called');
        t.ok(process.exit.calledWith(0),'and called with exit code 0')

       
        msalUtils.getTokenSilently.restore();
        graphUtils.readResource.restore();

        t.end();
     });

    t.test('get access token from cache and zero data from the MS graph', async (t) => {
        const msalUtils = require('../lib/msal-utils');

        sinon.stub(msalUtils, 'getTokenSilently');
        msalUtils.getTokenSilently.returns('ey...ye');

        sinon.stub(graphUtils, 'readResource');
        graphUtils.readResource.returns({});

        const cli = await require('../lib/app.js').processRequest();

        t.ok(process.exit.called, 'Process exit should be called');
        t.ok(process.exit.calledWith(1), 'and failure indicated with exit code 1');
        

        msalUtils.getTokenSilently.restore();
        graphUtils.readResource.restore();

        t.end();
    });



    t.test(
        'get access token using deviceCode and data from the MS graph',
        async (t) => {
            const msalUtils = require('../lib/msal-utils');

            sinon.stub(msalUtils, 'getTokenSilently');
            msalUtils.getTokenSilently.returns('');

            sinon.stub(msalUtils, 'getTokenDeviceCode');
            msalUtils.getTokenDeviceCode.returns('ey..ye');

            sinon.stub(graphUtils, 'readResource');
            graphUtils.readResource.returns({
                displayName: 'Ola Normann',
                mail: 'ola.normann@norway.no',
            });

            const cli = await require('../lib/app.js').processRequest();

            t.ok(process.exit.called, 'Process exit should be called');
            t.ok(
                process.exit.calledWith(0),
                'and called with exit code 0'
            );

            msalUtils.getTokenSilently.restore();
            msalUtils.getTokenDeviceCode.restore();
            graphUtils.readResource.restore();

            t.end();
        }
    );

    t.test(
        'not able to get any access tokens',
        async (t) => {
            const msalUtils = require('../lib/msal-utils');

            sinon.stub(msalUtils, 'getTokenSilently');
            msalUtils.getTokenSilently.returns('');

            sinon.stub(msalUtils, 'getTokenDeviceCode');
            msalUtils.getTokenDeviceCode.returns('');

            const cli = await require('../lib/app.js').processRequest();

            t.ok(process.exit.called, 'Process exit should be called');
            t.ok(process.exit.calledWith(1), 'and failure indicated with exit code 1');

            msalUtils.getTokenSilently.restore();
            msalUtils.getTokenDeviceCode.restore();

            t.end();
        }
    );


    t.end();
});