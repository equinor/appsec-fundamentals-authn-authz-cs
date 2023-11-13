# Exploring changes to the app code

In this part we will explore the app and the code to get an idea of the moving parts and how they work together.

The end-user facing functionality of the app is not changed. The changes are on the internal logic.

## Changes

* We have introduced **session management**.
* We are using the **silent log-in** functionality of MSAL. Previously when we wanted to read the inbox our app acquired an access token for each request to the MS Graph Api. Now our app is doing a lookup into the token cache, if the user is identified (using the session) and has a valid token for the scope that is requested - the existing token will be used (hence - no trip to Azure AD to acquire a token for each request). If a valid token does not exist - MSAL will get this, store it in the token cache - and the use it.
* Sessions are stored "in-memory" at the client. The token cache for a "user" is stored in the session.
* We are **protecting end-points**. Only authenticated users can access /showinbox
* We have enhanced the /logout logic. It will remove the signed-in user from the token cache and destroy the app session.

## Exploring code changes (from ex-4)

Steps:

* Observe highlights in changes to the code (ex-04 vs. ex-05)
  </br>(Optional - Diff using VSCode)

  ```shell
  ./bin/src-diff.sh
  ```

* App config (./lib/app-config.js)
  * Adding scope for **silentRequest** into the MSAL config
* Web app (./src/app.js)
  * Adding support for cookies and sessions (for Fastify)
  * Using random key to encrypt cookie (this is not scalable)
  * Using memory store for sessions (this is not scalable)
  * Adding **isAuthenticated** which can be used to restrict access to end-points
  * Adding logic to app login/logout app (dependent on status of session)
  * /showinbox now uses getTokenSilently
* Html templating (./public, ./view)
  * Using the session status to relevant information (login, logout)
* Explore the authentication code (./lib/auth-utils.js) 
  * Logic to connect session to the token cache (storing homeAccountID in session)
  * Logic to update cache/session when user selects logout 
  * Function to get access token silently (using MSAL)
* Application tests
  * Increase mocks/stubs for session, cache and getting tokens silently
  * For auth-utils we now have more test code than functional code ....

## --Now You--

* Investigate the changes
* Identify the two different mechanisms that are used to protect end-points.

## --A note on SameSite attribute for the sessionId cookie--

* We use the _sessionId_ cookie to manage state between the end-user session and the back-end.
* We are using the [_SameSite_](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite) attribute to only allow the cookie to be sendt to a first-party or same site context. (Security, avoid CSRF )
* Browser handles the _SameSite_ attribute a bit differently - if not set explicitly
  * FireFox will from [v96](https://www.ghacks.net/2022/01/11/mozilla-firefox-96-0-release-here-is-what-is-new/) default to "Lax" as default if not specified.
  * Chrome is currently accepting _no value_ for the _SameSite_ attribute
* For OIDC based _redirect flows_ using POST (responseMode=form_post); "SameSite=Lax" will stop the browser redirect from sending the sessionId cookie to the server/back-end. This means that server will think this is a new session and create a new session object.
* For OIDC based _redirect flows_ using GET (responseMode=query); "SameSite=Lax" will NOT stop the browser redirect from sending the sessionId cookie to the server/back-end. 
* Using "POST" based redirect is default in OIDC
* Using "POST" based redirect in OIDC could introduce issues if you start using the session object prior to logging in (like we will do in ex-9 with PKCE)
  
## --Discuss security issues and good practices--

* Discuss the two different approaches to protecting end-point.
* Good practice: Secure defaults = all end-points are protected by default, explicit open for those which should be open.
* Discuss the importance of logging out of applications
  * From a end-user perspective
  * From the app operations perspective
* Discuss testability of the usage of framework increases
  * Execute the tests from "./ex-02" and "./ex-04" and compare coverage

    ```shell
    npm run test-cover
    ```
