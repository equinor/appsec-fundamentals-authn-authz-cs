'use strict';


// Adding some Game of Thrones Episodes demo data
const episodes = require('../data/got_demo_data');
const { logger } = require('../lib/logger.js');
const gotQuotes = require('../lib/quotes');


// Handlers
const getAllEpisodes = async(req, reply) => {
        
    logger.debug('Preparing to add a quote to getAllEpisodes');
  
    //Extracting token and getting quote
    let tokenArray = req.headers.authorization.split(' ');
    const aQuote = await gotQuotes.getQuote(tokenArray[1]);
 
    logger.debug('Got quote : ' + JSON.parse(aQuote).title);

    let episodesWithQuote = [...episodes];
    episodesWithQuote.push({
        id: 'Quote:',
        title: JSON.parse(aQuote).title,
        season: 9999
    })
    
    return reply.send(episodesWithQuote);
};

const getEpisode = async (req, reply) => {
    const id = Number(req.params.id); // Episode ID
    const episode = episodes.find((episode) => episode.id === id);

    if (episode) {
         return episode;
    } else {
        return 'Episode not found';
    }
   
};

const addEpisode = async (req, reply) => {
    const id = episodes.length + 1; // generate new ID
    const newEpisode = {
        id,
        title: req.body.title,
    };

    episodes.push(newEpisode);
    return newEpisode;
};

const updateEpisode = async (req, reply) => {
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

const deleteEpisode = async (req, reply) => {
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
