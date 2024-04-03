# Exploring the Episodes API Code

In this part we will explore the api code and configuration.

The api lives in `./ex-10/got-episodes-api`


Steps:

* Server and app code (./src/server.js, ./src/app.js)
  * The Server creates an instance of the web app (app.js)
  * The app code is the main api server
    * It's based on the [Fastify](https://www.fastify.io/) web framework.
    * It has support for CORS, rate-limiting and Swagger 
* Routes define the api routes (except for / and /doc)(./routes/routes/episodes.js)
  * Adds rudimentary validators for api verbs
  * Adds
    * GET - /api/episodes
    * GET - /api/episodes/:id
    * POST - /api/episodes
    * PUT - /api/episodes/:id
    * DELETE - /api/episodes/:id
* The Controller (./controller/episodes_controller.js)
  * The controller code for the api, adding functions to get all episodes, get one episode, add an episode, update an episode and delete an episode 
  * The controller reads episodes demo data from './data/got_demo_data'. No data is persisted, it's in memory for this version.
* Lib contains helpers (./lib)
  * 'app-config.js' to build and validate configuration params
  * 'auth.js' to help validating api requests, jwt token and scope vs api verbs
  * 'logger.js' - a log helper, deciding log levels based on node_env.
* Tests (./test)
  * Test code, coverage is basic, it's not including all verbs etc.

## --Now You--

* Investigate the code
  * Pay particularly attention to the token validation code in 'auth.js'
  * Find the url for public part of the keys that are used to sign the jwt token - investigate
* Make the tests for the episodes api execute (from ./ex-10/got-episodes-api)
  
  ```shell
  npm run test-cover
  ```

* Get an idea for test coverage by executing

  ```shell
  npx tap report
  ```

* When done - dehydrate and offer to help a fellow workshop participant

## --Discuss security issues and good practices--

* Security headers; we have implemented CORS, but traditional headers does not give much value for this simple API, they are more for the web browser / client
* Good practice: Do proper token validation (header, signature, audience, issuer, expired)
  * "Trust but verify"?
* Good practice: Use frameworks to do token validation, especially the crypto part
* Good practice: [OWASP Top 10 for api security](https://owasp.org/www-project-api-security/) is a good resource for securing your api's
  * #1 - API1:2023 - Broken Object Level Authorization (handled with fastify schemas)
  * #2 - API2:2023 - Broken Authentication  (the basic validation is in place (jwt))
  * #3 - API3:2023 - Broken Object Property Level Authorization (we have simple func auth with jwt, scope and schemas)
  * #4 - API4:2023 - Unrestricted Resource Consumption (we have implemented rate limiting)
  * #5 - API5:2023 - Broken Function Level Authorization (we have simple func auth with jwt, scope and schemas)
  * #6 .....

* 4 of the top 5 API security issues has to do with Authentication and Authorization
* Good practice: Create automated documentation of your api, Swagger or OpenApi are good choices.
