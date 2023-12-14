# Exploring the app code

In this part we will explore the app and the code to get an idea of the moving parts and how they work together.

The functionality of the ex-4 app is the same as ex-2.

Steps:

* Observe highlights in changes to the code (ex-02 vs. ex-04)
  </br>(Optional - Diff using VSCode from ./ex-02)
  ```shell
  ./bin/src-diff.sh
  ```
* App config (./lib/app-config.js)
  * New **msalConfig** object to feed the msal framework
* Server & web app end-points (./src/server.js, ./src/app.js)
  * Web-App: Removed a lot of end-point logic, state logic and verifications
  * Server: No changes
* Html templating (./public, ./view)
  * No changes
* Explore the authentication code (./lib/auth-utils.js) (largest part of the changes)
  * Removed a lot of specific http requests for driving the auth process
  * Added logic to create **confidential client** application using the MSAL framework
  * ReadInbox is un-changed
  * Simpler logic to get access token using MSAL
* Explore the logger code (./lib/logger.js)
  * Included severity levels for MSAL logging
* Application tests
  * Significant changes to authentication testing ('./test/auth-utils.test.js')
  * A lot more mocks and stubs

## --Now You--

* Investigate the changes to './lib/app-config.js' and './lib/auth-utils.js'
* The token cache is currently stored in memory. More on token caching in a later exercise.
* When done - it's a good time to hydrate and the offer your help to fellow participants.

## --Discuss security issues and good practices--

* Discuss the implications frameworks, especially auth frameworks?, have on testing.
