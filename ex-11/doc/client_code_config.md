# The Client - Code, Config and Start

In this part we will explore the client code and configuration.

The client code is based on the previous examples like ex-10. We will only focus on the significant parts.

## The Code

Steps:

* Observe highlights in changes to the client code (ex-10 vs. ex-11)
  </br>(Optional - Diff using VSCode)
  ```shell
  ./bin/src-diff.sh
  ```
* App config (./lib/app-config.js)
  * Makes **EPISODES_API_URI** config dynamic, read from the environment
  * Makes **EPISODES_API_URL** config dynamic, read from the environment
 

### --Now You--

* Investigate the steps above and identify the change
  
---

## The Config

* A new environment variable **export EPISODES_API_URI** that needs to be added to then env file
  * Hint: Microsoft Entra ID -> App Registrations -> Episodes Api -> Expose An Api -> Application ID URI
  * Hint: Exclude the prefix 'api://'
* Update the client env file (appsec-course-client-eq.env)

### --Now You--

* Do the steps above and update the config

---

## Start the client

Steps:

(Assuming you are in a terminal window at ./ex-11/client)

* Install dependencies, execute tests and do vulnerability scanning.    
* Source the configuration file

    ```shell
    source ~/envs/appsec-course-client-eq.env 
    ```

* Run the application

    ```shell
    npm start 
    ```

* Verify that the application is running
### --Now You--

* Do the steps above and verify that the client is running
* Login to the app
* Verify the "Show inbox" functionality
* Verify the "Show GOT Episodes" functionality
  * Observer the interaction between all 3 components
* Test stopping either of the api's and observe how the client works
  

