# Component: Cypress Client

These are the Cypress system tests for PAWA

## Install

    npm install

## Open Cypress in GUI mode

    npm run cypress:open

## Run Cypress tests in headless mode

    npm run cypres:run

## Open source dependency scanning

    npm run snyk

## Lint

    npm run lint

## Docker

Run from Docker image (rather then installing cypress locally)

    docker run -it --rm -v $PWD:/e2e -w /e2e cypress/included:12.1.0 --browser firefox --config baseUrl=http://host.docker.internal:"$CLIENT_PORT"
