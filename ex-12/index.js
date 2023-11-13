'use strict';

const {processRequest} = require('./lib/app.js');
const { logger, loglevel } = require('./lib/logger');

logger.info('About to process request');

processRequest();