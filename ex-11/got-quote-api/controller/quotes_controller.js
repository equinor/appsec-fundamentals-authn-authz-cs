'use strict';


// Adding some Game of Thrones Quotes demo data
var quotes = require('../data/quotes_demo_data');


// Handlers
const getRandomQuote = async (req, reply) => {
    
    var randomQuoteNo = Math.floor(Math.random() * quotes.length);

    return quotes[randomQuoteNo];
};


const showHomePage = async () => {
    const welcomeMessage = `
        
    The Game of Thrones Random Quote Api
        
    /api/quote
    /doc

    Authentication is required for all endpoints (expect for / and /doc)

    `;

    return welcomeMessage;
};

module.exports = {
    getRandomQuote,
    showHomePage,
};
