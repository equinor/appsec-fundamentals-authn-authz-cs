# Component: Got Episodes Api

The is the Quotes API. For authenticated requests the api will return a random quote from Game of Thrones

## Prerequisites

- Node 18.12.1 (Tested)
- Docker (v20.10.21 tested)

## Install

    npm install

## Test

    npm test

## Run

### Config

Expects the following environment variables to execute properly

    export NODE_ENV=development
    export TENANT_ID=""
    export PORT=3200
    export HOST=127.0.0.1
    export QUOTES_API_URI=""
    export EPISODES_API_URI=""

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


## Docker

### Build

    docker build -t quote-api .

### Run

You need to source the .env file containing the necessary config prior to doing "docker run"

    
    docker run -p 3200:3200 \
    -i \
    --rm \
    --env PORT=3200 \
    --env NODE_ENV="development" \
    --env TENANT_ID=$TENANT_ID \
    --env CLIENT_ID=$CLIENT_ID \
    --env EPISODES_API_URI=$EPISODES_API_URI \
    --env QUOTES_API_URI=$QUOTES_API_URI \
    quote-api

The file ./drun.sh contains the necessary setup for running the client inside a Docker container.
