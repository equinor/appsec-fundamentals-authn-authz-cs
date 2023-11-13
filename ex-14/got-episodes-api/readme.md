# Component: Got Episodes Api

The is the Episodes API. For authenticated requests the api will return a list of episodes from Game of Thrones.

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

    export NODE_ENV=production
    export TENANT_ID=""
    export PORT=3100
    export HOST=127.0.0.1
    export CLIENT_ID=""
    export CLIENT_SECRET=''
    export EPISODES_API_URI=""
    export QUOTES_API_URL="http://localhost:3200"
    export QUOTES_API_URI=""

### Execute

    npm start

## NPM commands

### Test

    npm test

    npm run test-cover  (continuous run, watch on canges, show coverage)

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

    docker build -t episodes-api .

### Run

You need to source the .env file containing the necessary config prior to doing "docker run"

    docker run -p 3100:3100 \
    -i \
    --rm \
    --env PORT=3100 \
    --env NODE_ENV="development" \
    --env REDIRECT_URI="http://localhost:3000/callback" \
    --env TENANT_ID=$TENANT_ID \
    --env CLIENT_ID=$CLIENT_ID \
    --env CLIENT_SECRET=$CLIENT_SECRET \
    --env EPISODES_API_URI=$EPISODES_API_URI \
    --env QUOTES_API_URI=$QUOTES_API_URI \
    --env QUOTES_API_URL=$QUOTE_API_URL \
    episodes-api

The file ./drun.sh contains the necessary setup for running the client inside a Docker container.
