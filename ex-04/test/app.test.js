'use strict';

//Defining config
process.env.TENANT_ID = 'A';
process.env.CLIENT_ID = 'B';
process.env.CLIENT_SECRET = 'C';
process.env.REDIRECT_URI = 'D';

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

    t.end();
});

//Needs to be execute prior to other teste to generate a state for the auth request
test('requests the "/showinbox" route should redirect', async (t) => {
    
    // delete require.cache[require.resolve('../lib/auth-utils.js')];
    // delete require.cache[require.resolve('../src/app.js')];

    // const authUtils = require('../lib/auth-utils.js');

    //Could stub msal to make this work, but this would more or less be repating the tests for authutils.
    //Startegy will be to stub stuff in authutils - test value will in some cases be limited.

    // sinon.stub(authUtils, 'getTokenAuthCode').returns({
    //     response: {statusCode: 302}
    // });

    sinon.stub(authUtils, 'getTokenAuthCode');
    authUtils.getTokenAuthCode.callsFake(async function (request,reply) {
        return reply.redirect(302,'url');
    });
    
    const testApp = require('../src/app').build();

    const response = await testApp.inject({
        method: 'GET',
        url: '/showinbox',
    });

    t.equal(response.statusCode, 302, 'returns a redirect status code of 302');

    authUtils.getTokenAuthCode.restore();

    t.end();
    
});

// // // Testing /callback with GET

test('/callback with GET', (t) => {

       t.beforeEach(function (t) {
           sinon.stub(authUtils, 'requestAccessTokenUsingAuthCode');
           authUtils.requestAccessTokenUsingAuthCode.callsFake(async function (
               authCode
           ) {
               return {};
           });
           sinon.stub(authUtils, 'readInbox').returns({});
       });

       t.afterEach(function (t) {
           authUtils.requestAccessTokenUsingAuthCode.restore();
           authUtils.readInbox.restore();
       });

       t.test('bad request - no accessToken received', async (t) => {
           const testApp = require('../src/app').build();
           
           const response = await testApp.inject({
               method: 'GET',
               url: '/callback',
               query: { code: 'GetCode' },
           });
           t.equal(response.statusCode, 400, 'returns a status code of 400');

           t.end();
       });

       t.test('ok request - accessToken received', async (t) => {
           const testApp = require('../src/app').build();
           
           authUtils.requestAccessTokenUsingAuthCode.restore();
           sinon.stub(authUtils,'requestAccessTokenUsingAuthCode').returns('ey..ye');
          
           const response = await testApp.inject({
               method: 'GET',
               url: '/callback',
               query: { code: 'GetCode' },
           });

           t.equal(response.statusCode, 200, 'returns a status code of 200');

           t.end();
       });

    t.end();

});

// // // Testing /callback with POST

test('/callback with POST', (t) => {

    t.beforeEach(function (t) {
        sinon.stub(authUtils, 'requestAccessTokenUsingAuthCode');
        authUtils.requestAccessTokenUsingAuthCode.callsFake(async function (
            authCode
        ) {
            return {};
        });
        sinon.stub(authUtils, 'readInbox').returns({});
    });

    t.afterEach(function (t) {
        authUtils.requestAccessTokenUsingAuthCode.restore();
        authUtils.readInbox.restore();
    });

    t.test('bad request - no accessToken received', async (t) => {
        const testApp = require('../src/app').build();
        
        const response = await testApp.inject({
            method: 'POST',
            url: '/callback',
            payload: { code: 'PostCode'}
        });
        t.equal(response.statusCode, 400, 'returns a status code of 400');

        t.end();
    });


    t.test('ok request - accessToken received', async (t) => {
        const testApp = require('../src/app').build();

        authUtils.requestAccessTokenUsingAuthCode.restore();
        sinon
            .stub(authUtils, 'requestAccessTokenUsingAuthCode')
            .returns('ey..ye');

        const response = await testApp.inject({
            method: 'POST',
            url: '/callback',
            payload: { code: 'PostCode' },
        });

        t.equal(response.statusCode, 200, 'returns a status code of 200');

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
