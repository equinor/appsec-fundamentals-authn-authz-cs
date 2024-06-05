# The Quotes API - Code, Config and Start

In this part we will explore the Quotes Api code and configuration.

The Quotes API is new, but it is based on the same pattern as the episodes api. The api resides in `ex-11/got-quote-api`

## The Code

Only significant changes will be mentioned.

Steps:

* App config (`./lib/app-config.js`)
* The App
  * A new controller for quotes, exposes /api/quote. Will return a random quote if request is validated
  * Exposes '/' and '/doc' (Swagger)
  * ```auth.js``` ```authVerify``` does jwt token validation
    * Validating appid of calling api (new for Quote)
    * Note the potential error: ```appid claim``` vs. EPISODES_API_URI  (ClientId and Application ID URI defaults to same value, but does not have to be)


### --Now You--

* Examine the steps above and identify the changes to config
* Investigate code and follow flow for the quotes route, validator, controller and authorization validation
  
---

## The Config

### Microsoft Entra ID

We need to create a new Microsoft Entra ID App Registration for Quotes Api.

Using the procedure from [exercise 10](../../ex-10/doc/registering_api_in_azure_ad.md) create a new app registration. The important values will be:
* Name: **(initial)-appsec-course-quotes-api**
* Expose an api and add scope: **Quote.Read**
* Give the episodes api permission to use the **Quote.Read** scope

### --Now You--

* Do the steps above and create the new app registration.

---
### Quotes .env file

* Create a new .env file for the quotes api (appsec-course-api-quotes-eq.env).
  ```shell
  code ~/envs/appsec-course-api-quotes-eq.env
  ```
  * It should contain the following config:

    ```shell
    export NODE_ENV=development
    export TENANT_ID=""
    export PORT=3200
    export QUOTES_API_URI=""
    export EPISODES_API_URI=""
    export EPISODES_API_CLIENT_ID=""
    ```

### --Now You--

* Do the steps above and create the new .env file.

---

## Start the Quotes APi

Steps:

(Assuming you are in a terminal window at ./ex-11/got-quote-api)

* cd into `./ex-11/got-quote-api`
  ```shell
  cd ./ex-11/got-quote-api
  ```
* Install dependencies and execute tests
* Source the configuration file

    ```shell
    source $HOME/envs/appsec-course-api-quotes-eq.env
    ```

* Run the application

    ```shell
    npm start 
    ```

* Verify that the Quote Api is running in your browser

### --Now You--

* Do the steps above and verify that the API is running
