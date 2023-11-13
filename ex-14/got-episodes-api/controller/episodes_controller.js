'use strict';


// Adding some Game of Thrones Episodes demo data
var episodes = require('../data/got_demo_data');
const { logger } = require('../lib/logger.js');


// Handlers
const getAllEpisodes = async (req) => {
    
    
    //Adding some logic to add a GOT Quote to the response of this endpoint
    const gotQuotes = require('../lib/quotes');
    
    logger.debug('Preparing to add a quote to getAllEpisodes');
  
    //Extracting token
    var tokenArray = [];
    tokenArray = req.headers.authorization.split(' ');

    const aQuote = await gotQuotes.getQuote(tokenArray[1]);
 
    logger.debug('Got quote : ' + JSON.parse(aQuote).title);

    var episodesWithQuote = [...episodes];
    episodesWithQuote.push({
        id: 'Quote:',
        title: JSON.parse(aQuote).title,
        season: 9999
    });
    
   
    return episodesWithQuote;
};

const getEpisode = async (req) => {
    const id = Number(req.params.id); // Episode ID
    const episode = episodes.find((episode) => episode.id === id);

    if (episode) {
        return episode;
    } else {
        return 'Episode not found';
    }
   
};

const addEpisode = async (req) => {
    const id = episodes.length + 1; // generate new ID
    const newEpisode = {
        id,
        title: req.body.title,
    };

    episodes.push(newEpisode);
    return newEpisode;
};

const updateEpisode = async (req) => {
    const id = Number(req.params.id);
    episodes = episodes.map(episode => {
        if (episode.id === id) {
            return {
                id,
                title: req.body.title,
            };
        } else {
            return episode;
        }
    });

    return {
        id,
        title: req.body.title,
    };
};

const deleteEpisode = async (req) => {
    const id = Number(req.params.id);

    episodes = episodes.filter(episode => episode.id !== id);
    return { msg: `Episode with ID ${id} is deleted` };
};

const showHomePage = async () => {
    const welcomeMessage = `
        
    The Game of Thrones Episodes API
        
    /api/episodes

    /api/episodes/1
    GET to get specific episode
    PUT to update specific episode
    POST to add episode
    DELETE to delete episode

    Authentication is required for all endpoints (expect for /)

    `;

    return welcomeMessage;
};

module.exports = {
    getAllEpisodes,
    getEpisode,
    addEpisode,
    updateEpisode,
    deleteEpisode,
    showHomePage
};
