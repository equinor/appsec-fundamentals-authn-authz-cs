# Running the client and the api

In this part we will execute the apps for the client and the episodes api. Remember that both components needs to be executed in their separate terminal windows.


## The Episodes Api

Steps:

(Assuming you are in a terminal window at ./ex-10/got-episodes-api)
  
* Source the configuration file

    ```shell
    source ~/path-to-env-file/appsec-course-api-episodes-eq.env 
    ```

* Run the application 

    ```shell
    npm start 
    ```

* Verify that the application is running by:
  * Browse to **http://localhost:3100**
  * Test the **/doc** end point

### --Now You--

* Do the steps above
* Play around with the Swagger interface


## The Client


Steps:

(Assuming you are in a terminal window at ./ex-10/client)
  
* Source the configuration file

    ```shell
    source ~/path-to-env-file/appsec-course-client-eq.env
    ```

* Run the application
  
    ```shell
    npm start 
    ```

* Use the application from your browser at **http://localhost:3000**

### --Now You--

* Do the steps above
* Log in and use the "Show Got Episodes" functionality
* Observe how the two components interacts (via logs in the terminal windows)
* Extract an access token from the client and use it to get episode #2 utilizing the Episodes API's Swagger interface

If time:
* Extract an access token from the client and use it to delete episode #3 utilizing the Episodes API's Swagger interface
  

## User consent, rather than client authorization

Let's experiment wih user consent, rather than authorizing a client for a scope.

Steps:

* For the Episodes api, remove the client authorization for scope **Episodes.Read**, save.
* Stop the client, delete the token cache, start the **Client**, login, select "Show GOT Episodes", observe the error.
* "Copy" the full scope uri for **Episodes.Read** (api://...../episodes.read) from the episodes app registration.
* Add this scope to the client's login request
  * './lib/app-config', msalConfig.request.authCodeUrlParameters.scopes: []'
  * Stop the client, delete the token cache and Start the client
  * Activate the "Application Developer" role in Azure PIM.
  * Login and recognize the additional consent request for **episodes.read**
  * Select "Show GOT Episodes" and verify that it works.
  * Observe the user consent in the clients permission (Enterprise Application, Permissions, User Consent)

### --Now You--

* Do the steps above
* Revert back to client authorization for the **episodes.read** scope, revoke user consent, delete token cache, verify new set-up.

## --Discuss security issues and good practices--

* There are multiple ways of *triggering* the user consent flow. We did it during the login phase. It can be done using scripts, api, manual "login" url's etc.
* Questions: Can an access token contain multiple audiences in the jwt token? Yes, according to the spec multiple audiences can be used. However, Azure AD is [per-resource-per-scope](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md) for access tokens; so when using Azure AD an access token can only have one audience. The practical consequence of this is that you will have to request a separate access token for each resouce (protected resource)
* There is an alternative way of chaining api's like we have started to do now, the [On-Behalf-Of](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow) flow in the MS Identity platform. We'll dive into this in a later exercise.
* In many cases we would like to use "sender-constrained" access tokens, that's access tokens that are bound to a specific client [oAuth Security Topic, 2.2.1](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics#section-2.2.1). This is currently not available in Azure AD. This will be important moving forward!
* Good practice: Embed the [Equinor API Strategy](https://github.com/equinor/api-strategy), the [Rest API Guidelines](https://github.com/equinor/api-strategy/blob/master/docs/rest_guidelines.md) and the [Api Security](https://github.com/equinor/api-strategy/blob/master/docs/strategy.md#api-security) part of the strategy into your teams work.
