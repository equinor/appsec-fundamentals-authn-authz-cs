'use strict';

const { test } = require('tap');
var sinon = require('sinon');
const __ = require('underscore');
const got = require('got');

test('Read resouce should return proper data', (t) => {

    t.beforeEach(() => {
        delete require.cache[require.resolve('../lib/graph-utils.js')];
        process.env.TENANT_ID = 'TENANT-A';
        process.env.CLIENT_ID = 'CLIENT-B';
        process.env.TOKEN_CACHE_FILE = './test/cache.json';

        sinon.stub(got, 'get');

    });

    t.afterEach(() => {
        got.get.restore();
    });


    t.test('Returned object from /me', async (t) => {
       
        const { readResource } = require('../lib/graph-utils.js');

        got.get.callsFake(async () => {

            const meObject = {
                        displayName: 'Ola Nordmann',
                        mail: 'ola.normann@norway.no',
                  };
            const responseObject = {body: JSON.stringify(meObject)};
            return responseObject;

        });

        const accessToken = 'ey...ye';
        const me = await readResource(accessToken, 'https://endpoint');

        t.ok(__.has(me,'displayName'),'should contain property display name');
        t.ok(__.has(me, 'mail'), 'should contain property mail');

        
        t.end();
    });


    t.test('Returned object from /me', async (t) => {
        const { readResource } = require('../lib/graph-utils.js');


        got.get.throws('GOT ERROR','Stub returning got error');
      
        const accessToken = 'ey...ye';
        const me = await readResource(accessToken, 'https://endpoint');

        t.ok(__.isEmpty(me), 'should be empty when request to /me failes');

        t.end();
    });


    t.end();
});
