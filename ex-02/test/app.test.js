'use strict';

//Defining config
process.env.TENANT_ID = 'A';
process.env.CLIENT_ID = 'B';
process.env.CLIENT_SECRET = 'C';

const { test } = require('tap');
const app = require('../src/app');
const authUtils = require('../lib/auth-utils.js');
var sinon = require('sinon');

test('requests the "/" route', async (t) => {
    const app = require('../src/app').build();

    const response = await app.inject({
        method: 'GET',
        url: '/',
    });
    t.equal(response.statusCode, 200, 'returns a status code of 200');
    t.equal(
        response.headers['content-type'],
        'text/html; charset=utf-8',
        'of content type app/json and charset UTF-8'
    );
    t.end();
});

test('requests the "/public/styles" route', async (t) => {
    const testApp = require('../src/app').build();

    const response = await testApp.inject({
        method: 'GET',
        url: '/public/styles/style.css',
    });
    t.equal(response.statusCode, 200, 'returns a status code of 200');
    t.equal(
        response.headers['content-type'],
        'text/css; charset=UTF-8',
        'of content type text/css; charset=UTF-8'
    );
});

//Needs to be execute prior to other teste to generate a state for the auth request
test('requests the "/showinbox" route should redirect', async (t) => {
    const testApp = require('../src/app').build();

    const response = await testApp.inject({
        method: 'GET',
        url: '/showinbox',
    });
    t.equal(response.statusCode, 302, 'returns a redirect status code of 302');
});

// // Testing /callback with GET

test('/callback with GET', (t) => {

       t.beforeEach(function (t) {
           sinon.stub(authUtils, 'requestAccessTokenUsingAuthCode');
           authUtils.requestAccessTokenUsingAuthCode.callsFake(async function (
               authCode
           ) {
               return {};
           });
       });

       t.afterEach(function (t) {
           authUtils.requestAccessTokenUsingAuthCode.restore();
       });

       t.test('bad request, code and state, but no access_token', async (t) => {
           const testApp = require('../src/app').build();
           const response = await testApp.inject({
               method: 'GET',
               url: '/callback',
               query: { code: 'GetCode', state: app.returnState() },
           });
           t.equal(response.statusCode, 400, 'returns a status code of 400');

           t.end();
       });

       t.test('bad request (no code in response)', async (t) => {
           const testApp = require('../src/app').build();

           const response = await testApp.inject({
               method: 'GET',
               url: '/callback',
           });
           t.equal(response.statusCode, 400, 'returns a status code of 400');
           t.end();
       });

       t.test('bad request (no state in response)', async (t) => {
           const testApp = require('../src/app').build();

           const response = await testApp.inject({
               method: 'GET',
               url: '/callback',
               query: { code: 'GetCode' },
           });
           t.equal(response.statusCode, 400, 'returns a status code of 400');
           t.end();
       });

       t.test('bad request, state does not match', async (t) => {
           const testApp = require('../src/app').build();

           const response = await testApp.inject({
               method: 'GET',
               url: '/callback',
               query: { code: 'GetCode', state: 'Abc123' },
           });
           t.equal(response.statusCode, 400, 'returns a status code of 400');
           t.end();
       });

       t.test(
           'good request, state matched, access token returned',
           async (t) => {
               
               const testApp = require('../src/app').build();

               authUtils.requestAccessTokenUsingAuthCode.restore();
               sinon.stub(authUtils, 'requestAccessTokenUsingAuthCode');

               authUtils.requestAccessTokenUsingAuthCode.callsFake(
                   async function (authCode) {
                       return 'eyAAAAAAAAAbg';
                   }
               );

               sinon.stub(authUtils, 'readInbox');
               authUtils.readInbox.callsFake(
                   async function (accessToken) {
                       return [];
                   }
               ) 

               const response = await testApp.inject({
                   method: 'GET',
                   url: '/callback',
                   query: { code: 'GetCode', state: app.returnState() },
               });
               t.equal(
                   response.statusCode,
                   200,
                   'returns a status code of 200'
               );

                authUtils.readInbox.restore();


               t.end();
           }
       );


    t.end();

});

// // Testing /callback with POST

test('/callback with POST', (t) => {

    t.beforeEach(function (t) {
        sinon.stub(authUtils, 'requestAccessTokenUsingAuthCode');
        authUtils.requestAccessTokenUsingAuthCode.callsFake(async function (
            authCode
        ) {
            return {};
        });
    });

    t.afterEach(function (t) {
        authUtils.requestAccessTokenUsingAuthCode.restore();
    });

    t.test(
        'bad request, code and state, but no access_token',
        async (t) => {

            const testApp = require('../src/app').build();
            const response = await testApp.inject({
                method: 'POST',
                url: '/callback',
                payload: { code: 'PostCode', state: app.returnState() },
            });
            t.equal(response.statusCode, 400, 'returns a status code of 400');

            t.end();
        }
    );

    t.test('bad request (no code in response)', async (t) => {
        const testApp = require('../src/app').build();

        const response = await testApp.inject({
            method: 'POST',
            url: '/callback',
        });
        t.equal(response.statusCode, 400, 'returns a status code of 400');
        t.end();
    });

    t.test('bad request (no state in response)', async (t) => {
        const testApp = require('../src/app').build();

        const response = await testApp.inject({
            method: 'POST',
            url: '/callback',
            payload: { code: 'PostCode' },
        });
        t.equal(response.statusCode, 400, 'returns a status code of 400');
        t.end();
    });


    t.test('bad request, state does not match', async (t) => {
        const testApp = require('../src/app').build();

        const response = await testApp.inject({
            method: 'POST',
            url: '/callback',
            payload: { code: 'PostCode', state: 'Abc123' },
        });
        t.equal(response.statusCode, 400, 'returns a status code of 400');
        t.end();
    });


    t.test('good request, state matched, access token returned', async (t) => {
       const testApp = require('../src/app').build();

       authUtils.requestAccessTokenUsingAuthCode.restore();
       sinon.stub(authUtils, 'requestAccessTokenUsingAuthCode');
       
       authUtils.requestAccessTokenUsingAuthCode.callsFake(async function (
           authCode
       ) {
           return 'eyAAAAAAAAAbg';
       });

        sinon.stub(authUtils, 'readInbox');
        authUtils.readInbox.callsFake(async function (accessToken) {
            return [];
        }); 

        const response = await testApp.inject({
            method: 'POST',
            url: '/callback',
            payload: { code: 'PostCode', state: app.returnState() },
        });
        t.equal(response.statusCode, 200, 'returns a status code of 200');

        authUtils.readInbox.restore();

        t.end();
    });


    
    t.end();
});

test('requests the "/public" route which should not support listing', async (t) => {
    const testApp = require('../src/app').build();

    const response = await testApp.inject({
        method: 'GET',
        url: '/public',
    });
    t.equal(response.statusCode, 404, 'returns a status code of 404');

});

test('requests the "/api" route', async (t) => {
    const testApp = require('../src/app').build();

    const response = await testApp.inject({
        method: 'GET',
        url: '/api',
    });
    t.equal(response.statusCode, 404, 'Should return a 404 Not found');
});

test('The app title should be as expected', async (t) => {
    const app = require('../src/app').build();

    const response = await app.inject({
        method: 'GET',
        url: '/',
    });
    t.equal(response.statusCode, 200, 'returns a status code of 200');
    t.ok(response.body.indexOf('<title>A-and-A FTW</title>') > 0)
    t.end();
});