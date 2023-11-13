'use strict';

var quotesController = require('../controller/quotes_controller');
var auth = require('../lib/auth.js');


//Adding route validators
const getRandomQuoteValidation = {
    params: {},
    headers: {
        type: 'object',
        properties: {
            Authorization: { type: 'string' },
        },
        required: ['authorization'],
    },
    security: [
        {
            Bearer: [],
        },
    ],
};

//Defining routes
const routes = [
    {
        method: 'GET',
        url: '/',
        handler: quotesController.showHomePage,
    },
    {
        method: 'GET',
        url: '/api/quote',
        schema: getRandomQuoteValidation,
        preHandler: auth.authVerify,
        handler: quotesController.getRandomQuote,
    },
];

module.exports = routes;
