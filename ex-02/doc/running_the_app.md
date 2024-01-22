# Running the application

In this part we will execute the application and explore the impact of a few selected config parameters.

## Port forwarding

When using Github Codespaces we are running out applications in a virtual environment. To enable a workspace to receive traffic from the outside we use port forwarding. You can read more on [Forwarding ports in your codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace). A few notes:

- Codespaces will usually forwards a port automatically when your application attaches to the port locally.
- You can configure Port Forwarding as part of the `/.devcontainer/devcontainer.json`
- You can configure Port Forwarding using the github CLI (`gh`)
- Ports have visibility "Private", "Private to Organization" and "Public". The two first ones expects an authenticated session with Github. The "Public" is public to the world - not authentication control is added by Codespaces.
- For our application using "Private" will work for all out-of-the-box exercises

## Starting the application


Steps:

* Run the application (from the terminal window where you defined the config variable)
  ```shell
  npm start
  ```
* Open the application using the Popup indicating that the app i running on port 3000 and offering a "Open in Browser" button. No need to make the port public
* Open the browser and test the application
* Stop the application
* Observe that the "automatic port forwarding" is removing the forward for port 3000
* Set the NODE_ENV to "development"

  ```shell
  export NODE_ENV=development
  ```

* Start the back-end (`npm start`)
* Observe that the "automatic port forwarding" is adding the forward for port 3000
* Use the application again and observer the logging
* Observe that the port forwarding is Private so it remembered your decision

## --Now You--

* Do the steps above
* Follow the oauth dance by inspecting the log
  * The [Microsoft Entra ID Spec](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow) for the OAuth2 Auth Code Flow
  * First leg: redirect to login.microsoftonline.com (the 302) with params and redirect_uri
  * Second leg: receive code on redirect_uri endpoint, use code to request access token 
* Extract the access token and inspect at [jwt.ms](https://jwt.ms)
* Experiment with changing a few parameters of the authorization request (auth-utils.js)
  * (npm will use the NODE_ENV to determine which dependencies to install)
  * Using "dev" mode with auto restart on changes is nice when experimenting
    ```shell
    npm run dev
    ````
  * prompt
  * scope
* Explore what consent you have given to apps on Microsoft Entra ID on [myapps.microsoft.com](https://myapps.microsoft.com/)
 * Test revoking for your app (if available in the list, if not can you find how to add it to the list? :) )

## --Discuss security issues and good practices--

* It is bad practice to extract information from tokens that are not intended for you
  * Example: Extracting "given_name" at the client from the Access Token
* Port forwarding with "public" represents a security risk

## Prologue

### response_mode vs. response_type
URL parameters from 1st leg, "getting authorization code"
* **response_type** is part of oauth2 spec [rfc6749](https://datatracker.ietf.org/doc/html/rfc6749)
* **response_mode** is part of OIDC [core](https://openid.net/specs/openid-connect-core-1_0.html)
  * Specifies the method for sending back the token to the client
  * Not part of rfc6749 (oAuth2)
  * The Microsoft Identity Platform add this as a optional/recommended parameters for oAuth2 as well. Default value is "query"
