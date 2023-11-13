'use strict';

//Defining config
process.env.TENANT_ID = 'A';

const { test } = require('tap');
var __ = require('underscore');
var quotes = require('../data/quotes_demo_data');


test('Should return a quote', async (t) => {
    //Creating object for stubbing the reply/response object
    var reply = {};

    //Creating object for stubbing the request
    const request = {
        headers: {},
        params: {
        },
    };

    var controller = require('../controller/quotes_controller.js');

    const quote = await controller.getRandomQuote(request, reply);

    t.ok(__.indexOf(quotes, quote) > -1,'Returned a valid quote');

    t.end();
});

