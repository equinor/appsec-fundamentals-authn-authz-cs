# Exploring the Client Code

In this part we will explore the client code and configuration.

The client code is based on the previous examples like ex-9. We will only focus on the significant parts.

Steps:

* Observe highlights in changes to the client code (ex-09 vs. ex-10/client)
  
  </br>(Optional - Diff using VSCode)
  ```shell
  ./bin/src-diff.sh
  ```
* App config (./lib/app-config.js)
  * New **gotApiUrl** to tell the client where to look for the api
  * New **scopes** section with key **gotApi** - to tell the client which scope to request for episodes api.
  * New **tokenCacheFile** - we are moving the MSAL token cache out to a file
* The Web App (./src/app.js)
  * Using new module **helmet** (fastify-helmet) to add security headers
  * Using new module **fastify-cors** to enable CORS for our application
  * Adding logic for the **secure** param of the sessionID cookie
    * _Secure_ is defined in [rfc6265](https://datatracker.ietf.org/doc/html/rfc6265) - the cookie will only be transported over a secure channel - **https**)
    * Using secure defaults, **secure = true** is the default
    * If **NODE_ENV=development/test**, then assume **http** and set secure to **false
    * This is also connected to "same-site" for cookies. Same-site = "lax" requires "secure. Same-site = "strict" will kill the logic for auth code flow and the redirect (callback).
  * Add new end-point for "/got" (got episodes)
    * Requests needs to be authenticated
    * Getting access token for the api request silently
    * Depending on request, render list of episodes or error message
* .lib/cachePlugins.js
  * A simple, non production, plug-in to serialize - de-serialize the token cache.
  * The plug-in implements #2 in our [Sessions & Token Cache Patterns](../../ex-05/doc/sessions_caches_patterns.md#2---cache---persisting-storage)
  * We are using the MSAL framework - only adding the persistence our-selves. MSAL takes care of the rest.
  * Remember: Token cache is not segmented on session.
* Html templating (./public, ./view)
  *  New button to request GOT Episodes
  *  Logic to make the "login" - "logout" to context sensitive
* Tests
  * New tests for /got endpoint
  * New tests for gotepisodes.js
  

## --Now You--

* Investigate the code changes to the client
* Make the tests for the client run (from ./ex-10/client) :)
  ```shell
  npm test
  ```

## --Discuss security issues and good practices--

* Discuss: Risks related to persisting the token cache in a file
* Discuss: Do the risk/re-ward for enabling **https*** on local development environment that we should use https locally as well?
  * Potential approaches:
    * Using [mkcert](https://github.com/FiloSottile/mkcert) as a local CA
    * Shell Scripts to create and install self generated CA certs
    * [dotnet dev-certs](https://docs.microsoft.com/en-us/dotnet/core/additional-tools/self-signed-certificates-guide) for .Net
  * What would potentially not work?
* Good advice: Use [https://securityheaders.com/](https://securityheaders.com/) to scan your applications

