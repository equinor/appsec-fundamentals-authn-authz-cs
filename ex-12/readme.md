# EX-12-Device-Code-Grant

In this exercise we will explore the Device Code Grant. This grant is designed for devices that lacks a browser for doing authorization. It's used in devices like smart TV's, printers and not the least - a lot of CLI's (Command Line Interfaces).

## Outline

* [RFC8628 -  OAuth 2.0 Device Authorization Grant](doc/device_code_grant.md)
* [The Example App and Code](doc/cli_app_code.md)
* [Running the CLI](doc/running_the_cli.md)

----

## Install

    npm install

## Test

    npm test

## Run

### Config

Expects the following environment variables to execute properly

    export NODE_ENV=production
    export TENANT_ID=""
    export CLIENT_ID=""
    export TOKEN_CACHE_FILE="${HOME}/.tcache/cache.json"
    
Examine './lib/cli-config' and './config/authConfig.json' to get additional details on how the config drives the application. The directory holding the token cache file must exist.

**The token cache is stored in an un-encrypted file. This not a production pattern!!**


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
