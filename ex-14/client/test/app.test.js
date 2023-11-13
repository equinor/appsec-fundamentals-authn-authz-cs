'use strict';


//Defining config
process.env.TENANT_ID = 'A';
process.env.CLIENT_ID = 'B';
process.env.CLIENT_SECRET = 'C';
process.env.TOKEN_CACHE_FILE = './test/cache.json';
process.env.EPISODES_API_URL = 'http://localhost:3100/';
process.env.REDIRECT_URI = 'http://localhost:3000/callback';

const { test } = require('tap');
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

test('requests the "/showinbox" should be redirected un-authenticated', async (t) => {
    
    sinon.stub(authUtils, 'isAuthenticated');
    authUtils.isAuthenticated.callsFake(() => {
        return false;
    });

    const testApp = require('../src/app').build();

    const response = await testApp.inject({
        method: 'GET',
        url: '/showinbox',
    });

    t.equal(response.statusCode, 302, 'returns a status code of 302');

    authUtils.isAuthenticated.restore();

    t.end();
    
});

test('requests the "/showinbox" handle authenticated requests', async (t) => {
    
    sinon.stub(authUtils, 'getTokenSilently');
    authUtils.getTokenSilently.callsFake(async function () {
        //returning access token
        return 'ey...ye';
    });

    sinon.stub(authUtils, 'getAccountName');
    authUtils.getAccountName.callsFake(() => {
        return {
            username: 'ola@normann.com',
            name: 'Ola Normann',
        };
    });

    sinon.stub(authUtils, 'readInbox');
    authUtils.readInbox.callsFake(() => {
        return {};
    });

    sinon.stub(authUtils, 'isAuthenticated');
    authUtils.isAuthenticated.callsFake(() => {
        return true;
    });

    const testApp = require('../src/app').build();

    const response = await testApp.inject({
        method: 'GET',
        url: '/showinbox',
    });

    t.equal(response.statusCode, 200, 'returns a status code of 200');

    authUtils.getAccountName.restore();
    authUtils.readInbox.restore();
    authUtils.isAuthenticated.restore();
    
    t.end();
});


// // // Testing /callback with GET

test('/callback with GET', (t) => {

    // t.beforeEach(function (t) {
              
    // });

    // t.afterEach(function (t) {
   
    // });

    t.test('bad request - no accessToken received', async (t) => {
        const testApp = require('../src/app').build();
           
        sinon.stub(authUtils, 'requestAccessTokenUsingAuthCode').returns('');

        const response = await testApp.inject({
            method: 'GET',
            url: '/callback'
        });
        t.equal(response.statusCode, 400, 'returns a status code of 400');

        authUtils.requestAccessTokenUsingAuthCode.restore();
        t.end();
    });

    t.test('ok request - accessToken received', async (t) => {
        const testApp = require('../src/app').build();
           
        sinon.stub(authUtils,'requestAccessTokenUsingAuthCode').returns('ey..ye');
          
        const response = await testApp.inject({
            method: 'GET',
            url: '/callback',
            query: { code: 'GetCode' },
        });

        t.equal(response.statusCode, 302, 'returns a status code of 302 - redirect');

        authUtils.requestAccessTokenUsingAuthCode.restore();
        t.end();
    });

    t.end();

});

// // // Testing /callback with POST

test('/callback with POST', (t) => {

    // t.beforeEach(function (t) {

    // });

    // t.afterEach(function (t) {

    // });

    t.test('bad request - no accessToken received', async (t) => {
        const testApp = require('../src/app').build();
        
        sinon.stub(authUtils, 'requestAccessTokenUsingAuthCode').returns('');

        const response = await testApp.inject({
            method: 'POST',
            url: '/callback',
            payload: { code: 'PostCode'}
        });

        t.equal(response.statusCode, 400, 'returns a status code of 400');

        authUtils.requestAccessTokenUsingAuthCode.restore();

        t.end();
    });


    t.test('ok request - accessToken received', async (t) => {
        const testApp = require('../src/app').build();

        sinon.stub(authUtils, 'requestAccessTokenUsingAuthCode').returns('ey..ye');

        const response = await testApp.inject({
            method: 'POST',
            url: '/callback',
            payload: { code: 'PostCode' },
        });

        t.equal(response.statusCode, 302, 'returns a status code of 302 - redirect');

        authUtils.requestAccessTokenUsingAuthCode.restore();

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
