# Running the application

In this part we will configure and execute the application

Steps:

(Assuming you are in a terminal window at `./ex-04`)
  
* Source the configuration file

    ```shell
    source ~/path-to-env-file/appsec-course-client-eq.env
    npm start
    ```

* Run the application 
    * If problems; remember that the forwarded port needs to be PUBLIC and that the redirect uri is dynamic.

    ```shell
    npm start
    ```

* Use the application and test the "get Inbox" feature
* Stop the application and set the NODE_ENV to "development"

    ```shell
    export NODE_ENV=development
    ```

* Run the application again and observer the logging

## --Now You--

* Do the steps above
* Extract the access token and inspect at [jwt.ms](https://jwt.ms)
  
## --Discuss security issues and good practices--

* Good practice: Frameworks may seem like a black box. It is smart to know the frameworks well
* It is good practice to know the specifications (RFC's) well
* It is good practice to be able to observe from the outside (proxies) how flows are working - and thus know when standards are deviated from. (MSAL implement OAuth2 and OIDC - knowing how OAuth2 and OIDC helps your observe that the framework is operating as expected)

