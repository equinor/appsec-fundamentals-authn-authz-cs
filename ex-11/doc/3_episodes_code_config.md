# The Episodes API - Code, Config and Start

In this part we will explore the Episodes Api code and configuration.

The api is based on the previous examples like ex-10. We will only focus on the significant parts. The api resides in `ex-11/got-episodes-api`.

## The Code

Steps:

* Observe highlights in changes to the episodes code (ex-10 vs. ex-11)
  </br>(Optional - Diff using VSCode)
  
  ```shell
  ./bin/src-diff.sh
  ```

* App config (./lib/app-config.js)
  * Make **EPISODES_API_URI** config dynamic, read from the environment
  * Make **QUOTES_API_URL** config dynamic, read from the environment 
  * Make **QUOTES_API_URI** config dynamic, read from the environment 
  * Add **CLIENT_SECRET** config dynamic, read from the environment 
  * Add **CLIENT_ID** config dynamic, read from the environment
  * Enhance logic that verify config
* The Quotes worker (./lib/quotes.js)
  * One function to get new access token for quotes using OBO
  * One function to request a quote with the new access token 

### --Now You--

* Inspect the steps above and identify the changes to config
* Investigate the Quotes worker code
  
---
## The Config

* The episodes env file (appsec-course-api-episodes-eq.env) needs to be updated with new config
* Open appsec-course-api-episodes-eq.env
  
  ```shell
  code $HOME/envs/appsec-course-api-episodes-eq.env
  ```

* Add following config
  
  ```shell
  export NODE_ENV="development"
  export TENANT_ID=""
  export CLIENT_ID=""
  export CLIENT_SECRET=''
  export EPISODES_API_URI=""
  export QUOTES_API_URL="http://localhost:3200"
  export QUOTES_API_URI=""
  export PORT=3100
  ```

* Add this config - explore the Microsoft Entra ID App registrations to find the proper values.
  * Hint: You may have to create a new value for the secret, see [exercise 1](../../ex-01/doc/registering_app_object_in_azure_ad.md)
* Explore the Microsoft Entra ID App registrations to find the proper values.
  * Hint: You may have to create a new value for the secret

### --Now You--

* Do the steps above and update the config

---

## Start the Episodes APi

Steps:

(Assuming you are in a terminal window at `./ex-11/got-episodes-api`)
  
* Install dependencies

    ```shell
    npm install
    ```

* Execute tests

    ```shell
    npm test
    ```
  
* Source the configuration file

    ```shell
    source ~/envs/appsec-course-api-episodes-eq.env
    ```

* Run the application

    ```shell
    npm start 
    ```

* Verify that the application is running at port 3100

### --Now You--

* Do the steps above and verify that the API is running