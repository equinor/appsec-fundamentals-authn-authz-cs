# Running the application

In this part we will configure and execute the application

Steps:

(Assuming you are in a terminal window at ./ex-05)
  
* Source the configuration file</br>(`aa-create-env-files-from-github-user-secret.sh` may be helpful if you have lost the config)
  
    ```shell
    source ~/envs/appsec-course-client-eq.env
    ```

* Run the application 

    ```shell
    npm start
    ```

* Open the appliation in the browser. Remember that the forwarded port needs to be public.
* Stop the application and set the NODE_ENV to "development"

    ```shell
    export NODE_ENV=development
    ```

* Run the application again and observer the logging

## --Now You--

* Do the steps above
* In the browser, identify the cookie that is used for session management
  * Alter content of, or delete, the cookie that holds the sessions id. Observer the changes to the application.
* Observe from logging when getting tokens silently is used. 
  * Try to provoke getting a new token from Microsoft Entra ID?
  * How could we monitor/observe this behavior from the "outside"?

## --Discuss security issues and good practices--

* Good practice: Cookies holding session information should be marked as "secure" (available using http only)
* Good practice: Move the session store out of the in-memory store. The cookie signing key should be part of app config params.
* Good practice: Move the token cache out of the in-memory store.
* Good practice: Follow security advices and recommendations for frameworks
  * Most frameworks have this ([Fastify](https://www.fastify.io/docs/latest/Guides/Recommendations/), [Express](https://expressjs.com/en/advanced/best-practice-security.html))
* Good practice: Know your frameworks! It takes time & capacity when complexity is hidden in multiple layers!
* Good practice: Add controls to identify and manage session cookie stealing (browser fingerprinting, changes in ip, user-agent etc.)
