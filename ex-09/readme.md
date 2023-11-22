# EX-9 - Authorization Code Flow with Proof Key for Code Exchange (PKCE)

In this section we will explore PKCE.

## Outline

* [Preparing the environment](doc/preparing_the_environment.md)
* [Explore the code](doc/exploring_the_code.md)
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