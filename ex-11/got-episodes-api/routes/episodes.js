'use strict';

var episodesController = require('../controller/episodes_controller');
var auth = require('../lib/auth.js');


//Adding route validators
const getAllEpisodeValidation = {
    description: 'List all GOT episodes',
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

const getEpisodeValidation = {
    params: {
        id: { type: 'string' },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                title: { type: 'string' },
            },
        },
    },
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

const addEpisodeValidation = {
    body: {
        type: 'object',
        required: ['title'],
        properties: {
            title: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                title: { type: 'string' },
            },
        },
    },
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

const updateEpisodeValidation = {
    params: {
        id: { type: 'string' },
    },
    body: {
        type: 'object',
        required: ['title'],
        properties: {
            title: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                title: { type: 'string' },
            },
        },
    },
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

const deleteEpisodeValidation = {
    params: {
        id: { type: 'string' },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                msg: { type: 'string' },
            },
        },
    },
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
        handler: episodesController.showHomePage,
    },
    {
        method: 'GET',
        url: '/api/episodes',
        schema: getAllEpisodeValidation,
        preHandler: auth.authVerify,
        handler: episodesController.getAllEpisodes,
    },
    {
        method: 'GET',
        url: '/api/episodes/:id',
        schema: getEpisodeValidation,
        preHandler: auth.authVerify,
        handler: episodesController.getEpisode,
    },
    {
        method: 'POST',
        url: '/api/episodes',
        schema: addEpisodeValidation,
        preHandler: auth.authVerify,
        handler: episodesController.addEpisode,
    },
    {
        method: 'PUT',
        url: '/api/episodes/:id',
        schema: updateEpisodeValidation,
        preHandler: auth.authVerify,
        handler: episodesController.updateEpisode,
    },
    {
        method: 'DELETE',
        url: '/api/episodes/:id',
        schema: deleteEpisodeValidation,
        preHandler: auth.authVerify,
        handler: episodesController.deleteEpisode,
    },
];

module.exports = routes;
