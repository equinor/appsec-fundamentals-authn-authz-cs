# EX-7 - Refresh tokens

In this section we will examine the characteristics of refresh tokens.

## What are refresh tokens?

* Refresh tokens are credentials used to obtain access tokens
* Refresh tokens are used to get new access token when current one expire
* Refresh tokens are used to get new access token to narrow scope
* Refresh tokens are issued by the authorization server and are never used by resource servers
* Refresh tokens is only issued to secure clients (Not supported by implicit flow)
* Refresh tokens can be stored on back-end to perform operations on behalf of user when not logged in
* Refresh tokens are quite often about user experience (not requesting authentication all the time)

### RFC6749

* Refresh tokens are defined in [rfc6749, section 1.5](https://tools.ietf.org/html/rfc6749#section-1.5)
* Section [6.  Refreshing an Access Token](https://datatracker.ietf.org/doc/html/rfc6749#section-6) describes how to get a new access token using a refresh token

### Framework support

* Framework support for automatic handling of refresh tokens is varying
* Verify support in each framework
* [Flows](https://docs.microsoft.com/nb-no/azure/active-directory/develop/msal-authentication-flows#how-each-flow-emits-tokens-and-codes) that emits refresh tokens in Azure
* MSAL support using refresh tokens out of the box
  * Getting refresh tokens with ID Token and Access Token
  * Will identify that access token has expired or is not valid - and then silently use the refresh token to acquire a new access token.
* Including "offline_access" in scope for OIDC will usually return an refresh token along with the other tokens.
* (Public clients using auth code flow with PKCE will get refresh tokens - but with a shorter life time (24 hours) )

### --Now You--

(Assuming you use the app from ex-5)

* Figure a way to extract the refresh token from the client application
* Explore the token in [jwt.ms](https://jwt.ms)

## --Discuss security issues and good practices--

* Good practice: Find a framework that has support for getting and using refresh tokens?
* Good practice: Treat refresh tokens as **secrets!**

## --Security considerations--

* Keep the refresh tokens safe
* In Microsoft Entra ID we are not able to set life time for refresh tokens ([MS Docs](https://learn.microsoft.com/en-us/azure/active-directory/develop/refresh-tokens))
  * Default are 24 hours for single page apps
  * Default are 90 for other scenarios
* Certain events will [revocate](https://learn.microsoft.com/en-us/azure/active-directory/develop/refresh-tokens#revocation) refresh tokens
