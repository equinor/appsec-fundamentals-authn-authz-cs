# EX-10-EPISODES-API

The is the Episodes API. For authenticated requests the api will return a list of episodes from Game of Thrones.

## Install

    npm install

## Test

    npm test

## Run

### Config

Expects the following environment variables to execute properly

    export NODE_ENV=production
    export TENANT_ID=""
    export PORT=3100
  
Other config, like rate-limiting and **apiAudience** , is defined in './lib/app-config.js' and also needs to be verified.

### Execute

    npm start

## NPM commands

### Test

    npm test

    npm run test-cover  (continuous run, watch on changes, show coverage)

### Development mode

    npm run dev (continuous run server, reload on changes)

### Open source dependency scanning

    npm run snyk

To keep modules updated:

    npm outdated
    npm upgrade
    npm install <module>@latest (remember to verify and execute test before breaking versions)
