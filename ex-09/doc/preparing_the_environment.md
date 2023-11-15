# Preparing the development environment

In this part we will prepare the development environment for executing the web application.

## Code

Steps:

* You will use the (bash)command line for the next steps
* Navigate to the "./ex-09" directory
* Install dependencies </br>(You want to consult the [Proxy Guide](../doc/../../doc/md/proxy.md) if you have connectivity issue)
  
```shell
npm install
```

* Execute tests

```shell
npm test
```

## --Now You--

* Do the steps

## Microsoft Entra ID

A few words on configuring the Microsoft Entra ID registration for our application.

* Our application is a web app. This is defined in the "App registration" -> "Authentication" -> "Platform Configuration"
* For a SPA application you would (not valid for our example, we use the hybrid mode)
  * Add a platform "SPA"
  * Enter Redirect URL
  * Make sure your SPA uses Auth Code Flow with PKCE and using [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).
  * If used, implicit grant must be enabled specifically under the "Implicit grant and hybrid flows" section of the app registration authentication menu.

## The Redirect URI

* The redirect URI is the location where the authorization server sends the user once the application has been successfully authenticated.
* Redirect URI's are case-sensitive and must match case. For redirect uri constrains, valid schemas etc consult the [MS Identity platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/reply-url)
* Since requests to localhost never leaves the client, it has a few [exceptions](https://docs.microsoft.com/en-us/azure/active-directory/develop/reply-url#localhost-exceptions)
  * _http_ is acceptable (not only _https_)
  * The _port component_ is ignored
    * No need to register multiple redirect URI when only port differs
    * Use the path component to differ between flows/apps if necessary.
  * For our app this means that:
    * We do not need the port in the AAD App configuration (http://localhost/callback will work just fine)
    * We still need the port when configuring the back-end (for a web app)

