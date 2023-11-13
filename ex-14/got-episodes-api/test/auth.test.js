'use strict';

//Defining config
process.env.TENANT_ID = 'A';
process.env.CLIENT_ID = 'C';
process.env.CLIENT_SECRET = 'B';
process.env.QUOTES_API_URL = 'http://localhost:3100/';
process.env.EPISODES_API_URI = 'a-b-c-d';

const { test } = require('tap');
var sinon = require('sinon');

test('AuthVerify should behave as expected', (t) => {

    // t.beforeEach(function (t) {});

    // t.afterEach(function (t) {});

    var auth = require('../lib/auth');

    t.test('No Accesstoken in header', async (t) => {

        //Creating object for stubbing the reply/response object
        var reply = {
            code: function () {
                return {
                    send: function () {
                        return true;
                    },
                };
            },
        };

        //Creating object for stubbing the request
        const request = {
            headers: {
            }
        };

        sinon.spy(reply);

        await auth.authVerify(request, reply);

        t.ok(reply.code.calledOnce, 'Reply - code called once');            
        t.ok(reply.code.calledWith(401),'and returned a 401 - unauthorized');

        t.end();
    });


    t.test('Bad Accesstoken in header', async (t) => {
        //Creating object for stubbing the reply/response object
        var reply = {
            code: function () {
                return {
                    send: function () {
                        return true;
                    },
                };
            },
        };

        //Creating object for stubbing the request
        const request = {
            headers: {
                authorization: 'Bearer ey...ye',
            },
        };

        sinon.spy(reply);

        await auth.authVerify(request, reply);

        t.ok(reply.code.calledOnce, 'Reply - code called once');
        t.ok(reply.code.calledWith(400), 'and returned a 400 - bad request');

        t.end();
    });
    
    t.end();

});
