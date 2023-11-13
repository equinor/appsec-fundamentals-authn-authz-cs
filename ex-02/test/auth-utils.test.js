'use strict';

//Defining config
process.env.TENANT_ID = 'A';
process.env.CLIENT_ID = 'B';
process.env.CLIENT_SECRET = 'C';

const { test } = require('tap');
const authUtils = require('../lib/auth-utils.js');
var __ = require('underscore');
var sinon = require('sinon');
const got = require('got');

test('Request accesstoken should respond with access token', async (t) => {
   
    const authCode = '1234'

    //Creating response object, some objects are strings of JSON!
    const responseObject = {"body" : '{"access_token": "eyABCDE"}'};

    sinon.stub(got,'post');
    got.post.callsFake(async function()  {
        return responseObject;
    });

    var accessToken = await authUtils.requestAccessTokenUsingAuthCode(
            authCode
        );
    
    console.log('AT: ' + accessToken);

   t.ok((__.size(accessToken) > 0), 'Access token received');
   t.ok(__.isString(accessToken),'Access token should be string');

   got.post.restore();  

   t.end();

});

test('Failed request to aquire access token should fail', async (t) => {
    const authCode = '1234';

    
    sinon.stub(got, 'get');
    got.get.throws("Test: Error from request to token endpoint");
    
    var accessToken = await authUtils.requestAccessTokenUsingAuthCode(authCode);

    t.ok(__.size(accessToken) == 0, 'Empty string, not access token received');
    t.ok(__.isString(accessToken), 'Access token should be string');

    got.get.restore();

    t.end();
});


test('Request to read inbox should return inbox content', async (t) => {
    
    const accessToken = 'eyABCDE';
    const emailReturnObject = {
            "value": [
                {
                    "subject": "Test Melding 1",
                    "sender": {
                        "emailAddress": {
                            "name": "Robert Knallert",
                            "address": "robert@knallert.com"
                        }
                    }
                },
                {
                    "subject": "Test Melding 2",
                    "sender": {
                        "emailAddress": {
                            "name": "Jon Snow",
                            "address": "jon@snow.com"
                        }
                    }
                }
            ]

            }

    const responseObject = { body: JSON.stringify(emailReturnObject) };

    sinon.stub(got, 'get');
    got.get.callsFake(async function () {
        return responseObject;
    });

    var newMails = await authUtils.readInbox(accessToken);

    t.ok(__.size(newMails) > 0, 'Content of inbox received');
    t.equal(newMails[0],'Robert Knallert - Test Melding 1','Sender and subject of first message is validated');
    t.equal(newMails[1],'Jon Snow - Test Melding 2','Sender and subject of second message is validated');
    t.ok(__.isArray(newMails), 'New mails should be in array');

    got.get.restore();

    t.end();
});

test('Request to read inbox should return empty when error', async (t) => {
    const accessToken = 'eyABCDE';
    
    sinon.stub(got, 'get');
    got.get.throws('Test: Error from request to ms graph inbox');

    var newMails = await authUtils.readInbox(accessToken);
   
    t.ok(__.size(newMails) == 0, 'Empty array of new mails received');
    t.ok(__.isArray(newMails), 'New mails should be in array');

    got.get.restore();

    t.end();
});

test('user-agent header should be correct', async (t) => {
    

    t.test('useragent does not exist in package.json', (t) => {
    
    
        delete require.cache[require.resolve('../package.json')];

        const pkg = require('../package.json');
        
        delete pkg.useragent;
       

        const userAgent = authUtils.clientUserAgent();
    
        t.equal(userAgent, 'generic', 'useragent should be set to generic when not configured in package.json');

        t.end();
    });

     t.test('useragent exist in package.json', (t) => {
         
        delete require.cache[require.resolve('../package.json')];

        const pkg = require('../package.json');

        pkg.useragent = 'a-user-agent'
        
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
