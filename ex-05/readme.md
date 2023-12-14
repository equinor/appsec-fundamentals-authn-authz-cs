# EX-5 - Sessions

In this section we will explore session management, getting tokens silently (from cache). We are still using the "inbox" app. 

## Outline

* [Sessions & Token Cache Patterns](doc/sessions_caches_patterns.md)
* [Preparing the development environment](doc/preparing_the_environment.md)
* [Exploring the code](doc/exploring_the_code.md)
* [Running the application](doc/running_the_application.md)

----

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
    export REDIRECT_URI=https://...../callback

## Run

```shell
npm start
```
