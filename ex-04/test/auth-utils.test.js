'use strict';

const { test } = require('tap');
var __ = require('underscore');
var sinon = require('sinon');
const got = require('got');

//Defining config
process.env.TENANT_ID = 'A';
process.env.CLIENT_ID = 'B';
process.env.CLIENT_SECRET = 'C';
process.env.REDIRECT_URI = 'D';


//Strategy for test will be to stub msal and just verify the various paths
//taken depending on the msal output

test('Does authUtils work', (t) => {

    t.beforeEach(function () {
        //
    });

    t.afterEach(function () {
        //
    });

    test('Request to getTokenAuthCode should succeed', async (t) => {
        const msal = require('@azure/msal-node');
        
        delete require.cache[require.resolve('../lib/auth-utils.js')];

        //Creating object for stubbing the getAuthCodeUrl
        const authCodeUrl = function (param) {
            return new Promise((resolve, reject) => {
                resolve('http://a-nice-url');
            });
        };

        //Creating object for stubbing the reply/response object
        var reply = {
            redirect: function (code, url) {
                return true;
            },
        };

        //Creating object for stubbing the request
        const request = {
            query: {
                state: '1234',
                prompt: 'prompt',
                loginHint: 'hint',
                domainHint: 'domainhint',
            },
        };

        sinon.spy(reply);

        //stubbing msal and relevant functions
        sinon.stub(msal, 'ConfidentialClientApplication');
        msal.ConfidentialClientApplication.returns({
            getAuthCodeUrl: authCodeUrl,
        });

        const authUtils = require('../lib/auth-utils.js');
        await authUtils.getTokenAuthCode(request, reply);

        t.ok(reply.redirect.calledOnce, 'Reply - redirect called');
        t.ok(
            reply.redirect.calledWith(302, 'http://a-nice-url'),
            'Reply - redirect called with correct redir url and http 302'
        );

        msal.ConfidentialClientApplication.restore();

        t.end();
    });

    test('Request to getTokenAuthCode should fail when not redirect url', async (t) => {
        const msal = require('@azure/msal-node');

        delete require.cache[require.resolve('../lib/auth-utils.js')];  
        
        //Creating object for stubbing the getAuthCodeUrl
        const authCodeUrl = function (param) {
            return new Promise((resolve, reject) => {
                reject('error message');
            });
        };

        //Creating object for stubbing the reply/response object
        //Adding support for chaining functions - to mimic the current usage
        var reply = {
            code: (code) => ({
                send: (message) => ({
                    code,
                    message,
                }),
            }),
        };

        //Stubbing the reply.code().send() chain
        sinon.stub(reply, 'code').returns({
            send: sinon.stub().returns('a message'),
        });

        //Creating object for stubbing the request
        const request = {
            query: {
                state: '1234',
                prompt: 'prompt',
                loginHint: 'hint',
                domainHint: 'domainhint',
            },
        };

        //stubbing msal and relevant functions
        sinon.stub(msal, 'ConfidentialClientApplication');
        msal.ConfidentialClientApplication.returns({
            getAuthCodeUrl: authCodeUrl,
        });

        const authUtils = require('../lib/auth-utils.js');
        await authUtils.getTokenAuthCode(request, reply);

        t.ok(reply.code.calledWith(500), 'Reply - called with 500');
        t.ok(
            reply.code().send.calledWith('Redirect to get auth code failed'),
            'Send called'
        );

        msal.ConfidentialClientApplication.restore();

        t.end();
    });

    test('Request to get access token using code succeed', async (t) => {
        const msal = require('@azure/msal-node');

        delete require.cache[require.resolve('../lib/auth-utils.js')];

        const response = {
            accessToken: 'ey...ye',
        };
        
        //Creating object for stubbing the acquireTokenByCode
        const acquireTokenByCode = function (param) {
            return new Promise((resolve, reject) => {
                resolve(response);
            });
        };

        //stubbing msal and relevant functions
        sinon.stub(msal, 'ConfidentialClientApplication');
        msal.ConfidentialClientApplication.returns({
            acquireTokenByCode: acquireTokenByCode,
        });

        const authUtils = require('../lib/auth-utils.js');
        var token = await authUtils.requestAccessTokenUsingAuthCode('12324');

        t.ok(
            msal.ConfidentialClientApplication.calledOnce,
            'ConfidentialClientApplication was called'
        );
        t.ok(
            __.isEqual(response.accessToken, token),
            'Reply - expected access token was returned'
        );

        msal.ConfidentialClientApplication.restore();
        t.end();
    });

    test('Request to get access token using code should fail when no token received', async (t) => {
        const msal = require('@azure/msal-node');

        delete require.cache[require.resolve('../lib/auth-utils.js')];

        //Creating object for stubbing the acquireTokenByCode
        const acquireTokenByCode = function (param) {
            return new Promise((resolve, reject) => {
                reject('error message');
            });
        };

        //stubbing msal and relevant functions
        sinon.stub(msal, 'ConfidentialClientApplication');
        msal.ConfidentialClientApplication.returns({
            acquireTokenByCode: acquireTokenByCode,
        });

        const authUtils = require('../lib/auth-utils.js');
        var token = await authUtils.requestAccessTokenUsingAuthCode('12324');

        t.ok(
            msal.ConfidentialClientApplication.calledOnce,
            'ConfidentialClientApplication was called'
        );
        t.ok(__.isEmpty(token), 'Reply - empty accesstoken returned');
        t.rejects(acquireTokenByCode, 'acquireTokenByCode caught an error');

        msal.ConfidentialClientApplication.restore();
        t.end();
    });

    test('Request to read inbox should return inbox content', async (t) => {
        const accessToken = 'eyABCDE';
        const emailReturnObject = {
            value: [
                {
                    subject: 'Test Melding 1',
                    sender: {
                        emailAddress: {
                            name: 'Robert Knallert',
                            address: 'robert@knallert.com',
                        },
                    },
                },
                {
                    subject: 'Test Melding 2',
                    sender: {
                        emailAddress: {
                            name: 'Jon Snow',
                            address: 'jon@snow.com',
                        },
                    },
                },
            ],
        };

        const responseObject = { body: JSON.stringify(emailReturnObject) };

        delete require.cache[require.resolve('../lib/auth-utils.js')];
        const authUtils = require('../lib/auth-utils.js');

        sinon.stub(got, 'get');
        got.get.callsFake(async function () {
            return responseObject;
        });

        var newMails = await authUtils.readInbox(accessToken);

        t.ok(__.size(newMails) > 0, 'Content of inbox received');
        t.equal(
            newMails[0],
            'Robert Knallert - Test Melding 1',
            'Sender and subject of first message is validated'
        );
        t.equal(
            newMails[1],
            'Jon Snow - Test Melding 2',
            'Sender and subject of second message is validated'
        );
        t.ok(__.isArray(newMails), 'New mails should be in array');

        got.get.restore();

        t.end();
    });

    test('Request to read inbox should return empty when error', async (t) => {
        const accessToken = 'eyABCDE';

        delete require.cache[require.resolve('../lib/auth-utils.js')];
        const authUtils = require('../lib/auth-utils.js');

        sinon.stub(got, 'get');
        got.get.throws('Test: Error from request to ms graph inbox');

        var newMails = await authUtils.readInbox(accessToken);

        t.ok(__.size(newMails) == 0, 'Empty array of new mails received');
        t.ok(__.isArray(newMails), 'New mails should be in array');

        got.get.restore();

        t.end();
    });

    test('User-agent header should be correct', async (t) => {
        t.test('useragent does not exist in package.json', (t) => {
            delete require.cache[require.resolve('../lib/auth-utils.js')];
            const authUtils = require('../lib/auth-utils.js');

            delete require.cache[require.resolve('../package.json')];

            const pkg = require('../package.json');

            delete pkg.useragent;

            const userAgent = authUtils.clientUserAgent();

            t.equal(
                userAgent,
                'generic',
                'useragent should be set to generic when not configured in package.json'
            );

            t.end();
        });

        t.test('useragent exist in package.json', (t) => {
            delete require.cache[require.resolve('../lib/auth-utils.js')];
            const authUtils = require('../lib/auth-utils.js');

            delete require.cache[require.resolve('../package.json')];

            const pkg = require('../package.json');

            pkg.useragent = 'a-user-agent';

            const userAgent = authUtils.clientUserAgent();

            t.equal(
                userAgent,
                'a-user-agent',
                'useragent should be set by package.json'
            );

            t.end();
        });

        t.end();
    });

    t.end();
});