'use strict';

//Defining config
process.env.TENANT_ID = 'A';
process.env.CLIENT_ID = 'C';
process.env.CLIENT_SECRET = 'B';

process.env.QUOTES_API_URL = 'http://localhost:3100/';
process.env.EPISODES_API_URI = 'a-b-c-d';

const { test } = require('tap');
var sinon = require('sinon');

test('requests the "/" route', async (t) => {
    const app = await require('../src/app').build();

    const response = await app.inject({
        method: 'GET',
        url: '/',
    });
    t.equal(response.statusCode, 200, 'returns a status code of 200');
    t.equal(
        response.headers['content-type'],
        'text/plain; charset=utf-8',
        'of content type text/plain and charset UTF-8'
    );
    t.end();
});

test('requests the swagger "/doc" route', async (t) => {

    // t.beforeEach(function (t) {});

    // t.afterEach(function (t) {});

    const app = await require('../src/app').build();

    t.test('Request to /doc should redirect to static', async (t) => {
    
        const response = await app.inject({
            method: 'GET',
            url: '/doc',
        });
        t.equal(response.statusCode, 302, 'returns a status code of 302');
        t.equal(response.headers.location,'./doc/static/index.html','location is to static html');
        t.end();

    });

    t.test('Request to /doc/static/index.html should render swagger doc', async (t) => {
        const response = await app.inject({
            method: 'GET',
            url: '/doc/static/index.html',
        });
        t.equal(response.statusCode, 200, 'returns a status code of 200');
   
        t.end();
    });


    t.end();

});


test('security headers should be ok', async (t) => {
   
    const app = await require('../src/app').build();

    const response = await app.inject({
        method: 'GET',
        url: '/',
    });
    t.equal(response.statusCode, 200, 'returns a status code of 200');
    t.end();

});

test('Rate limiter should trigger', async (t) => {

    //Preparing for new config
    delete require.cache[require.resolve('../src/app.js')];
    delete require.cache[require.resolve('../lib/app-config.js')];

    //Defining constraints of rate limit
    const appConfig = require('../lib/app-config');
    sinon.stub(appConfig, 'rateLimitAllowList').returns([]);
    sinon.stub(appConfig, 'maxRateLimit').returns(0);

    const app = await require('../src/app').build();

    var response;
    
    response = await app.inject({
        method: 'GET',
        url: '/doc',
    });

    t.equal(response.statusCode, 429, 'returns a status code of 429 - too many requests');


    response = await app.inject({
        method: 'GET',
        url: '/doc',
    });

    t.equal(
        response.statusCode,
        429,
        'returns a status code of 429 - for second request'
    );

    response = await app.inject({
        method: 'GET',
        url: '/doc',
    });

    t.equal(
        response.statusCode,
        403,
        'returns a status code of 403 - forbidden ban limit for rate limiter is reached'
    );


    appConfig.rateLimitAllowList.restore();
    appConfig.maxRateLimit.restore();

    t.end();
});