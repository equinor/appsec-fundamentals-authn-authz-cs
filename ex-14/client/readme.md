# Component: CLIENT

The is the client. It will provide the ability to sign-in, show content of your inbox and the retrieve a list of GOT (Game of Thrones) episodes from the got episodes api (the second component of this exercise)

## Prerequisites

- Node 18.12.1 (lts/hydrogen - tested)
- Docker (v20.10.21 tested)

## Install

    npm install

## Test

    npm test

## Run

### Config

Expects the following environment variables to execute properly

    export NODE_ENV=development
    export PORT=3000
    export HOST=127.0.0.1
    export TOKEN_CACHE_FILE="${HOME}/.tcache/cache.json"

    export TENANT_ID=''
    export CLIENT_ID=''
    export CLIENT_SECRET=''
    export REDIRECT_URI="http://localhost:${PORT}/callback"

    export EPISODES_API_URI=""
    export EPISODES_API_URL="http://localhost:3100"

    export TEST_CLIENT_USERNAME=''
    export TEST_CLIENT_PASSWORD=''

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

    docker build -t client .

### Run

You need to source the .env file containing the necessary config prior to doing "docker run"

NB: Remember to update (local dir) for volume holding token cache.

    docker run -p 3000:3000 \
    -i \
    --rm \
    -v (lokal dir):/usr/src/app/data \
    --env PORT=3000 \
    --env NODE_ENV="development" \
    --env REDIRECT_URI="http://localhost:${PORT}/callback" \
    --env TENANT_ID=$TENANT_ID \
    --env CLIENT_ID=$CLIENT_ID \
    --env CLIENT_SECRET=$CLIENT_SECRET \
    --env EPISODES_API_URI=$EPISODES_API_URI \
    --env EPISODES_API_URL=$EPISODES_API_URL \
    --env TOKEN_CACHE_FILE="./data/cache.json"  \
    --env TEST_CLIENT_USERNAME=$TEST_CLIENT_USERNAME \
    --env TEST_CLIENT_PASSWORD=$TEST_CLIENT_PASSWORD \
    client

The file ./drun.sh contains the necessary setup for running the client inside a Docker container.
