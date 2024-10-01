# Requesting an Authorization Code using Rest Client.

At this point we will start the first leg of the OAuth2 Code Grant flow - getting the auth code that we later will use to request a token. We will use the VS Code Rest Client.

Steps:

* Let's start by looking at the [auth code flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow) in the documentation of the _Microsoft Identity Platform_
* Open a new terminal window if one is not already available.
  * Current directory should be `/workspaces/appsec-fundamentals-authn-authz-cs `
* Open the `./ex-01/authCode.http` file in VSCode.
  * Verify that the 'Rest Client' extension is active
* In 'authCode.http' - add value values for
  * Your tenant id to `@tenant_id=`
  * Your client id to `@client_id=`
  * The redirect URI to `@redirect_uri=`
* Explore the set-up and the `GET` request (The first leg)
  * In VSCode, select the GET request
  * Right-click and select 'Generate Code Snippet' ([doc](https://github.com/Huachao/vscode-restclient#generate-code-snippet))
  * Select 'Shell' and then 'cURL'
* Copy the `url` from the curl request
* Paste the url into your browser and execute
  * Using the Browser Web Developer Tools is recommended.
  * Why in the browser?
  * Why the "consent" flow?
  * The code is available in the redirect. It is "use once" within 10 minutes
  * (Depending on the State of your browser you may have to authenticate or not, explore the get request header for cookies)
  * Make a copy of the 'code' parameter in the redirect.
* For additional insight on the complete dance (optional)
  * (This may not work dependent on your compliant device status ⚡️)
  * Open a "private/incognito" window in your browser.
  * Open the Developer Tools
  * Select the option to persist logs
  * Copy the "get request" from VSCode, paste into browser, and execute
  * Explore the browser log, the auth, the 302 redirect to the configured URI containing the code, and the 404 "not found" at the end.

## --Now You--

* Do the steps above.
* When you are done, offer your help to other participants!

## --Discuss security issues and good practices--

* The communication happens in the "front-channel"
* Remember to remove invalid redirect URI's from your app objects
