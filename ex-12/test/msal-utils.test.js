'use strict';

const { test } = require('tap');
var sinon = require('sinon');
const __ = require('underscore');
const got = require('got');
const msal = require('@azure/msal-node');

//Test Config
process.env.TENANT_ID = 'TENANT-A';
process.env.CLIENT_ID = 'CLIENT-B';
process.env.TOKEN_CACHE_FILE = './test/cache.json';

const { config } = require('../lib/cli-config.js');


test('getTokenDeviceCode', (t) => {
    t.beforeEach(() => {
        delete require.cache[require.resolve('../lib/msal-utils.js')];
    });

    t.afterEach(() => {
        msal.PublicClientApplication.restore();
    });

    t.test('getTokenDeviceCode on success', async (t) => {
        sinon.stub(msal, 'PublicClientApplication');

        //The stub for acquireTokenByDeviceCode
        const acquireTokenByDeviceCode = function (param) {
            return new Promise((resolve, reject) => {
                resolve({ accessToken: 'ey..ye' });
            });
        };

        msal.PublicClientApplication.returns({
            acquireTokenByDeviceCode: acquireTokenByDeviceCode,
        });

        const pca = new msal.PublicClientApplication('');

        const { getTokenDeviceCode } = require('../lib/msal-utils.js');

        const accessToken = await getTokenDeviceCode(config, pca);

        t.equal(accessToken, 'ey..ye', 'should return an access token');

        t.end();
    });

    t.test('getTokenDeviceCode on failure', async (t) => {
        sinon.stub(msal, 'PublicClientApplication');

        //The stub for acquireTokenByDeviceCode
        const acquireTokenByDeviceCode = function (param) {
            return new Promise((resolve, reject) => {
                reject('');
            });
        };

        msal.PublicClientApplication.returns({
            acquireTokenByDeviceCode: acquireTokenByDeviceCode,
        });

        const pca = new msal.PublicClientApplication('');

        const { getTokenDeviceCode } = require('../lib/msal-utils.js');

        const accessToken = await getTokenDeviceCode(config, pca);

        t.equal(accessToken, '', 'should return an empty string');

        t.end();
    });


    t.end();
});



test('getTokenSilently', (t) => {
    t.beforeEach(() => {
        delete require.cache[require.resolve('../lib/msal-utils.js')];
    });

    t.afterEach(() => {
        msal.PublicClientApplication.restore();
    });

    t.test('getTokenSilently on success', async (t) => {
        sinon.stub(msal, 'PublicClientApplication');

        //The stub for acquireTokenSilent
        const acquireTokenSilent = function (param) {
            return new Promise((resolve, reject) => {
                resolve({ accessToken: 'ey..ye' });
            });
        };

        // The stub for token cache and getallaccount
        const getTokenCache = function (param) {

            const getAllAccounts = function (param) {
                return new Promise((resolve, reject) => {
                    resolve(['account0', 'account1']);
                });
            };

            return { getAllAccounts: getAllAccounts };
        };

        msal.PublicClientApplication.returns({
            acquireTokenSilent: acquireTokenSilent,
            getTokenCache: getTokenCache,
        });

        const pca = new msal.PublicClientApplication('');

        const { getTokenSilently } = require('../lib/msal-utils.js');

        const accessToken = await getTokenSilently(config, pca);

        t.equal(accessToken, 'ey..ye', 'should return an access token');

        t.end();
    });


    t.test('getTokenSilently on failure', async (t) => {
        sinon.stub(msal, 'PublicClientApplication');

        //The stub for acquireTokenSilent
        const acquireTokenSilent = function (param) {
            return new Promise((resolve, reject) => {
                reject('Unable to silently aquire access token');
            });
        };

        // The stub for token cache and getallaccount
        const getTokenCache = function (param) {
            const getAllAccounts = function (param) {
                return new Promise((resolve, reject) => {
                    resolve(['account0', 'account1']);
                });
            };

            return { getAllAccounts: getAllAccounts };
        };

        msal.PublicClientApplication.returns({
            acquireTokenSilent: acquireTokenSilent,
            getTokenCache: getTokenCache,
        });

        const pca = new msal.PublicClientApplication('');

        const { getTokenSilently } = require('../lib/msal-utils.js');

        const accessToken = await getTokenSilently(config, pca);

        t.equal(accessToken, '', 'should return an empty access token');

        t.end();
    });

    t.test('getTokenSilently - failure due to no accounts in cache', async (t) => {
       sinon.stub(msal, 'PublicClientApplication');

       // The stub for token cache and getallaccount
       const getTokenCache = function (param) {
           const getAllAccounts = function (param) {
               return new Promise((resolve, reject) => {
                   resolve([]);
               });
           };

           return { getAllAccounts: getAllAccounts };
       };

       msal.PublicClientApplication.returns({
           getTokenCache: getTokenCache,
       });

       const pca = new msal.PublicClientApplication('');

       const { getTokenSilently } = require('../lib/msal-utils.js');

       const accessToken = await getTokenSilently(config, pca);

       t.equal(accessToken, '', 'should return an empty access token');

       t.end();
    });


    t.end();
});