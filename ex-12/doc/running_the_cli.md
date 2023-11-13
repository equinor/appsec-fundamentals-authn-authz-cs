# Running the CLI

We are ready to run our cli. All commands assume you are in a terminal window, using bash (or similar) in folder './ex-12'.

Steps:

* Install dependencies

  ```shell
  npm install
  ```

* Execute the tests

  ```shell
  npm test
  ```

* Source the .env config

  ```shell
  source ~(path to env file)/appsec-course-cli-eq.env 
  ```

* Execute the cli

  ```shell
  npm start
  ```

* Open the url that's suggested ([https://microsoft.com/devicelogin](https://microsoft.com/devicelogin)) and enter the code thats presented
* Sign-in and give consent (remember to PIM yourself?)
  * If ok, your display name and email is printed
* Execute the cli again **npm start**
  * No device code, the app found a valid token in the cache
* Delete the token cache

  ```shell
  rm ~/.tcache/cache.json
  ```

* Execute the cli again **npm start**
  * The app is using the device code grant again
  * Examine the token cache and identify which tokens that are acquired
* Set the app in developer mode by altering the **NODE_ENV** variable

  ```shell
  export NODE_ENV=development
  ```

* Delete the token cache file and execute the cli. Observe the logging
* Execute the cli once again and observe the logging
* Identify what kind of consent that is given to the app
  * Hint: Enterprise Applications -> Cli App (your app) -> Permissions -> Admin Consent / User Consent
* Challenge:
  * Remove the consent you have given to your app - verify that you will have to consent again when using the cli.
    * Hint: "Visible to users" and patience is your friend :)

## --Now You--

* Do the steps above
* Play around with the code and the app - explore - be curious.
* When done - rehydrate and offer your help to fellow workshop participants.

## --Discuss security issues and good practices--

* Security issue - the token cache!
  * The client must be trusted (public vs. confidential client)?
  * The token requests includes a refresh token. The practical consequence is that the cli is silently able to request new token for quite a while without any user interaction (the default life time is 90 days - [MS Identity platform refresh tokens](https://docs.microsoft.com/en-us/azure/active-directory/develop/refresh-tokens))
  * The token cache must be stored outside source code folders, be protected and encrypted.
  * For public clients like SPA, Native Applications, CLI -- the token cache should be persisted and encrypted. One option is to use [MSAL Node Extensions](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/extensions/msal-node-extensions/README.md)

* In Azure, it is hard - some times impossible to identify and remove consent!
  * An app needs to be "visible to user" to show up in [MyApps](https://myapps.microsoft.com/).
  * If an admin have given consent, you can't remove it.
* The security considerations from [RFC8628](https://datatracker.ietf.org/doc/html/rfc8628#section-5) should be monitored
* Good-practice: For access tokens, request as little scope as possible
* Good-practice: Protect the token cache.
