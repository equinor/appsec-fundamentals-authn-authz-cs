'use strict';

//Defining config
process.env.TENANT_ID = 'A';

const { test } = require('tap');
var sinon = require('sinon');
var episodes = require('../data/got_demo_data');


test('Should return all episodes if requested', async (t) => {
    //Creating object for stubbing the reply/response object
    var reply = {};

    //Creating object for stubbing the request
    const request = {
        headers: {},
        params: {
        },
    };

    var controller = require('../controller/episodes_controller.js');

    const getEpisode = await controller.getAllEpisodes(request, reply);

    t.equal(getEpisode, episodes, 'Returned all episodes');

    t.end();
});

test('getEpisode', (t) => {
    t.beforeEach(function (t) {});

    t.afterEach(function (t) {});

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
        t.equal(getEpisode,episodes[0],'Returned episodes object')

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
