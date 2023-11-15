# EX-4 - Using Auth Frameworks

This app will list the context of your inbox. A web page is presented, when **show inbox** is selected the app will trigger a **authorization code grant flow** and list content of your inbox.

This version of the app uses the [Microsoft Authentication Library for Javascript](https://github.com/AzureAD/microsoft-authentication-library-for-js) (MSAL) - the [NodeJS](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) version.

## Outline

* [Exploring frameworks for OAuth2](doc/exploring_oauth2_frameworks.md)
* [Preparing the development environment](doc/preparing_the_environment.md)
* [Exploring the code](doc/exploring_the_code.md)
* [Running the application](doc/running_the_application.md)
* [Security considerations](doc/security_considerations.md)
* [Lines of code - dependency scanning](doc/lines_of_code.md)

---

## Architecture

NodeJS based backend, simple html on front end.
SSO using oauth with Microsoft Entra ID

Important NodeJS modules

* [Fastify](https://github.com/fastify/fastify) - web server framework
* [Handlebars](https://handlebarsjs.com/) - templating language
* [Got](https://github.com/sindresorhus/got) - http request library
* [Pino](https://getpino.io/#/) - NodeJs logger
* [Tap](https://node-tap.org/) - Test framework for JS
* [Sinon](https://sinonjs.org/) - Test spies, stubs and mocks for JS
* [MSAL for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) - Microsoft Auth library for Node

## Requirements

## Install

```shell
npm install
```

## Test

```shell
npm test
```

### Config

Expects the following environment variables to execute properly

    export NODE_ENV=production
    export CLIENT_SECRET=''
    export CLIENT_ID=""
    export TENANT_ID=""
    export PORT=3000

## Run

```shell
npm start
```

## NPM Scripts

* _npm test_ (execute unit tests)
* _npm run test-cover_ (run, reload on canges, show coverage)
* _npm run dev_ (run server, reload on changes)
* _npm run snyk_ (scan for open source vulnerabilities)

## Keeping the dependencies up-to-date

To keep modules updated:

* _npm outdated_ (list outdated modules)
* _npm upgrade_ (upgrade minor versions of modules)
* _npm install <module>@latest_ <br/>(remember to verify and execute test before major  version updated, or in fact after any update)
