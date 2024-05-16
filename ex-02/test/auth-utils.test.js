'use strict';

//Defining config
process.env.TENANT_ID = 'A';
process.env.CLIENT_ID = 'B';
process.env.CLIENT_SECRET = 'C';
process.env.REDIRECT_URI = 'D';

const { test } = require('tap');
const authUtils = require('../lib/auth-utils.js');
var __ = require('underscore');
var sinon = require('sinon');
const { getGot, resetGot } = require('./gotHelper.js');

test('Request access token should respond with access token', async (t) => {

    const authCode = '1234'

    //Creating response object, some objects are strings of JSON!
    const responseObject = {body : {access_token: 'eyABCDE'}};

    // Reset got instance before stubbing
    resetGot();

    const got = await getGot();
    sinon.stub(got, 'post').resolves(responseObject);
   
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

    // Reset got instance before stubbing
    resetGot();

    const got = await getGot();
    sinon.stub(got, 'get').throws(new Error("Test: Error from request to token endpoint"));
    
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
    };

    // Mock response object
    const responseObject = { body: emailReturnObject };

    // Reset got instance before stubbing
    resetGot();

    // Get the got instance and stub the get method
    const got = await getGot();
    sinon.stub(got, 'get').resolves(responseObject);

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

    // Reset got instance before stubbing
    resetGot();

    // Get the got instance and stub the get method to throw an error
    const got = await getGot();
    sinon.stub(got, 'get').throws(new Error('Test: Error from request to ms graph inbox'));

    var newMails = await authUtils.readInbox(accessToken);

    t.ok(__.size(newMails) === 0, 'Empty array of new mails received');
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
    });