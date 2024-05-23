'use strict';

//Defining config
process.env.TENANT_ID = 'A';
process.env.CLIENT_ID = 'C';
process.env.CLIENT_SECRET = 'B';
process.env.EPISODES_API_URI = 'C';
process.env.QUOTES_API_URI = 'D';
process.env.QUOTES_API_URL = 'E'

const { test } = require('tap');
let sinon = require('sinon');
let episodes = require('../data/got_demo_data');

test('Should return all episodes if requested', async (t) => {
    //Creating object for stubbing the reply/response object
    let reply = { send: () => {
        return ({title: 'a Quote'})
        }
    };

    //Creating object for stubbing the request
    const request = {
        headers: {
            authorization: 'ey...ye'
        },
        params: {
        },
    };

    let controller = require('../controller/episodes_controller.js');
    const gotQuotes = require('../lib/quotes');

    const getAllEpisodes = await controller.getAllEpisodes(request, reply);


    t.equal(getAllEpisodes.title, 'a Quote', 'Returned a quote');

    t.end();
});