'use strict';

//Defining config
process.env.TENANT_ID = 'A';
process.env.CLIENT_ID = 'C';
process.env.CLIENT_SECRET = 'B';
process.env.QUOTES_API_URL = 'http://localhost:3100/';
process.env.EPISODES_API_URI = 'a-b-c-d';

const { test } = require('tap');
var sinon = require('sinon');
var episodes = require('../data/got_demo_data');

test('Should return all episodes if requested', async (t) => {
    //Creating object for stubbing the reply/response object
    var reply = {};

    //Creating object for stubbing the request
    const request = {
        headers: {
            authorization: 'ey...ye'
        },
        params: {
        },
    };

    var controller = require('../controller/episodes_controller.js');
    const gotQuotes = require('../lib/quotes');

    sinon.stub(gotQuotes, 'getQuote').returns(JSON.stringify({title: 'a Quote'}));


    const getAllEpisodes = await controller.getAllEpisodes(request, reply);

    t.equal(getAllEpisodes[0], episodes[0], 'Returned all episodes, episode 1 is ok');
    t.equal(getAllEpisodes[1], episodes[1], 'Returned all episodes, episode 2 is ok');
    t.equal(getAllEpisodes[getAllEpisodes.length - 1].id,'Quote:', 'A quote was included at the end');
    

    gotQuotes.getQuote.restore();

    t.end();
});

test('getEpisode', (t) => {

    // t.beforeEach(function (t) {});

    // t.afterEach(function (t) {});

    var controller = require('../controller/episodes_controller.js');

    t.test('Should return episode if found', async (t) => {

        //Creating object for stubbing the reply/response object
        var reply = {
         
        };

        //Creating object for stubbing the request
        const request = {
            headers: {},
            params: {
                id: 1
            }
        };     


        const getEpisode = await controller.getEpisode(request, reply);

        t.equal(getEpisode.id, episodes[0].id, 'Returned episode 1');
        t.equal(getEpisode,episodes[0],'Returned episodes object');

        t.end();
    });

    t.test('Should return not found if not found', async (t) => {
        //Creating object for stubbing the reply/response object
        var reply = {
    
        };

        //Creating object for stubbing the request
        const request = {
            headers: {},
            params: {
                id: 99,
            },
        };

        const getEpisode = await controller.getEpisode(request, reply);

        t.equal(getEpisode, 'Episode not found', 'Returned episode not found');

        t.end();
    });



    t.end();
});
