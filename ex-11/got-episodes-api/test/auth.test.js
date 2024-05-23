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
const createError = require('http-errors');

test('AuthVerify should behave as expected', (t) => {

    t.beforeEach(function (t) {});

    t.afterEach(function (t) {});

    var auth = require('../lib/auth');

   t.test('No Accesstoken in header', async (t) => {


        const request = {
            headers: {
            }
        };

        const reply = {}


        try {
            await auth.authVerify(request, reply);
            t.fail('authVerify did not reject as expected');
            
        } catch (err) {
            t.equal(err.status, 401, 'No Auth header in request');
            t.match(err.message, "Unauthorized - missing authentication", "Error message should indicate unauthorized access");
        }

        t.end();
  
    });


    t.test('Bad Accesstoken in header', async (t) => {
        //Creating object for stubbing the reply/response object
        var reply = {};

        //Creating object for stubbing the request
        const request = {
            headers: {
                authorization: 'Bearer ey...ye',
            },
        };

        try {
            await auth.authVerify(request, reply);
            t.fail('authVerify did not reject as expected');
        } catch(err){
            t.equal(err.status, 400, 'Unable to decode token');
            t.match(err.message, "Unauthorized - bad request", "Error message should indicate bad request");

        }

        t.end();
    });
    
    t.end();

});
