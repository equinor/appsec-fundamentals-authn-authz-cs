'use strict';


//Defining config
process.env.NODE_ENV = 'development';
process.env.TENANT_ID = 'A';
process.env.CLIENT_ID = 'B';
process.env.CLIENT_SECRET = 'C';
process.env.TOKEN_CACHE_FILE = './test/cache.json';

const { test } = require('tap');
var __ = require('underscore');
var sinon = require('sinon');
const got = require('got');
const gotEpisodes = require('../lib/gotepisodes')


test('The GOT Api should behave as expected', (t) => {
    t.beforeEach(function () {
        //
    });

    t.afterEach(function () {
        //
    });

    test('Authenticated response returns series', async (t) => {

        const episodesData = [
                {
                    id: 1,
                    title: 'Winter is coming',
                    season: 1,
                },
                {
                    id: 2,
                    title: 'The Kingsroad',
                    season: 1,
                },
            ];

        const responseObject = {
            body: JSON.stringify(episodesData),
        };

        sinon.stub(got, 'get');
        got.get.callsFake(async function () {
            return responseObject;
        });

        const episodes = await gotEpisodes.getGOTepisodes('ey...ye');

        t.equal(episodes.length,2,'Two episodes are returned');
        t.equal(
            episodes[0],
            '1 - Winter is coming',
            'Title of first episode is correct'
        );

        got.get.restore();
    
        t.end();
    });

    test('Error from GOT Api is handled', async (t) => {
        
        sinon.stub(got, 'get');
        got.get.throws('Test: Error from GOT API');

        const episodes = await gotEpisodes.getGOTepisodes('ey...ye');
      
        t.equal(episodes.length, 1, '1 error i episodes are returned');
        t.equal(
            episodes[0],
            'Unable to retrieve GOT Episodes',
            'with message Unable to retrieve GOT Episodes'
        );

        got.get.restore();

        t.end();
    });



    t.end();
});
