'use strict';

//Defining config
process.env.TENANT_ID = 'A';
process.env.CLIENT_ID = 'C';
process.env.CLIENT_SECRET = 'B';
process.env.EPISODES_API_URI = 'C';
process.env.QUOTES_API_URI = 'D';
process.env.QUOTES_API_URL = 'E';


const { test } = require('tap');
var sinon = require('sinon');

test('AuthVerify should behave as expected', (t) => {

    t.beforeEach(function (t) {});

    t.afterEach(function (t) {});

    var auth = require('../lib/auth');

    t.test('No Accesstoken in header', async (t) => {

        //Creating object for stubbing the reply/response object
        var reply = {
            code: function (code) {
                return {
                    send: function (message) {
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

        //Creating object to stubb done
        const done = function () {
            return true
        }

        sinon.spy(reply);


        const authenticate = await auth.authVerify(request, reply, done);

        t.ok(reply.code.calledOnce, 'Reply - code called once');            
        t.ok(reply.code.calledWith(401),'and returned a 401 - unauthorized');


        t.end();
    });


    t.test('Bad Accesstoken in header', async (t) => {
        //Creating object for stubbing the reply/response object
        var reply = {
            code: function (code) {
                return {
                    send: function (message) {
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

        //Creating object to stubb done
        const done = function () {
            return true;
        };

        sinon.spy(reply);

        const authenticate = await auth.authVerify(request, reply, done);

        t.ok(reply.code.calledOnce, 'Reply - code called once');
        t.ok(reply.code.calledWith(400), 'and returned a 400 - bad request');

        t.end();
    });
    
    t.end();

});
