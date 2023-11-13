# Exploring changes to the app code

In this part we will explore the app and the code to get an idea of the moving parts and how they work together.

The end-user facing functionality of the app is not changed. The changes are on the internal logic.

## Changes

* Added support for PKCE for our confidential client for the initial access token acquisition (login). For MSAL Node PKCE is enabled by default for public clients.

## Exploring code changes (from ex-5)

Steps:

* Observe highlights in changes to the code (ex-05 vs. ex-09)
  </br>(Optional - Diff using VSCode)
  ```shell
  ./bin/src-diff.sh
  ```
* Explore the authentication code (./lib/auth-utils.js) 
  * The function 'getTokenAuthCode' has gotten logic to initiate PKCE calcs and stores in session object. (Remember the issue with OIDC, redirect POST vs. GET and the SameSite attribute on the cookie?)
  * The function 'requestAccessTokenUsingAuthCode' is using the PKCE codes
* Application tests
  *  Test for auth-utils have been updated to mock session and pkce codes.

## --Now You--

* Investigate the changes
* If time: Investigate the [MSAL Library Ref - Node](https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html)

  
## --Discuss security issues and good practices--

* Good practice: Know your frameworks
  * MSAL for Browser (public client) will automatically create and use PKCE
  * MSAL for Node (assuming a confidential client) will not (at least in current version) create and use PKCE
  * We have added the PKCE functionality for the login in our app. However, the silent functionality will not use PKCE.
  * It's recommended to use PKCE even with a confidential client




