# EX-2 - Getting an access token using code

The purpose of this exercise is get an access token using code. We are moving from the raw style http to exploring what's needed to get this done in code.

## Outline

* [The Scenario](doc/the_scenario.md)
* [Preparing the development environment](doc/preparing_the_environment.md)
* [Exploring the code](doc/exploring_the_code.md)
* [Environment variables](doc/environment_variables.md)
* [Running the application](doc/running_the_app.md)
* [Config & Secrets](doc/secrets.md)
* [Logging](doc/logging.md)

----

## Application Architecture

This app will list the context of your inbox. A web page is presented, when **show inbox** is selected the app will trigger a **authorization code grant flow** and list content of your inbox.

NodeJS based backend, simple html on front end.
SSO using oauth2/oidc with Microsoft Entra ID

Important NodeJS modules

* [Fastify](https://github.com/fastify/fastify) - web server framework
* [Handlebars](https://handlebarsjs.com/) - templating language
* [Got](https://github.com/sindresorhus/got) - http request library
* [Pino](https://getpino.io/#/) - NodeJs logger
* [Tap](https://node-tap.org/) - Test framework for JS

## Requirements

* Nodejs (tested on v18.18.0)

## Install

```shell
npm install
```

## Test

```shell
npm test
```

## Config

Expects the following environment variables to execute properly

    export NODE_ENV=production|development
    export CLIENT_SECRET="$APPSEC_AA_CLIENT_SECRET"
    export CLIENT_ID=""
    export TENANT_ID=""
    export PORT=3000
    export REDIRECT_URI=https://...../callback

## Run

```shell
npm start
```

## NPM Scripts

* _npm test_ (execute unit tests)
* _npm run test-cover_ (run, reload on changes, show coverage)
* _npm run dev_ (run server, reload on changes)
* _npm run snyk_ (scan for open source vulnerabilities)

## Keeping the dependencies up-to-date

To keep modules updated:

* _npm outdated_ (list outdated modules)
* _npm upgrade_ (upgrade minor versions of modules)
* _npm install <module>@latest_ <br/>(remember to verify and execute test before major  version updated, or in fact after any update)
