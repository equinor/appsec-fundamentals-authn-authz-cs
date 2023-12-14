# EX-11-CLIENT

The is the client. It will provide the ability to sign-in, show content of your inbox and the retrieve a list of GOT (Game of Thrones) episodes from the got episodes api (the second component of this exercise)

## Install

    npm install

## Test

    npm test

## Run

### Config

Expects the following environment variables to execute properly

    export NODE_ENV=production
    export CLIENT_SECRET=''
    export CLIENT_ID=""
    export TENANT_ID=""
    export PORT=3000
    export REDIRECT_URI=
    export EPISODES_API_URI=
    export EPISODES_API_URL="http://localhost:3100"
    export TOKEN_CACHE_FILE="${HOME}/.tcache/cache.json"

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
