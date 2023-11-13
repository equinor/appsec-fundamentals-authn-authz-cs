# Running the application

In this part we will execute the application and explore the impact of a few selected config parameters.

Steps:

* Run the application (from the terminal window where you defined the config variable)
```shell
npm start
```
* Use the application from your browser at **http://localhost:3000**
* Stop the application and set the NODE_ENV to "development"
```shell
export NODE_ENV=development
```
* Run the application again and observer the logging

## --Now You--

* Do the steps above
  * You may have to fix a minor configuration issue :)
* Follow the oauth dance by inspecting the log
  * The [Azure AD Spec](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow) for the OAuth2 Auth Code Flow
  * First leg: redirect to login.microsoft.com with params and redirect_uri
  * Second leg: receive code on redirect_uri endpoint, use code to request access token 
* Extract the access token and inspect at [jwt.ms](https://jwt.ms)
* Experiment with changing a few parameters of the authorization request
  * (npm will use the NODE_ENV to determine which dependencies to install)
  * Using "dev" mode with auto restart on changes is nice when experimenting
    ```shell
    npm run dev
    ````
  * prompt
  * response_mode
  * scope
* Explore what consent you have given to apps on Azure AD on [myapps.microsoft.com](https://myapps.microsoft.com/)
 * Test revoking for your app (if available in the list)

## --Discuss security issues and good practices--

* It is bad practice to extract information from tokens that are not intended for you
  * Example: Extracting "given_name" at the client from the Access Token

## Prologue

### response_mode vs. response_type

* **response_type** is part of oauth2 spec [rfc6749](https://datatracker.ietf.org/doc/html/rfc6749)
* **response_mode** is part of OIDC [core](https://openid.net/specs/openid-connect-core-1_0.html)
  * Specifies the method for sending back the token to the client
  * One of the reasons why our code supports both GET and POST requests to the redirect_uri endpoint
