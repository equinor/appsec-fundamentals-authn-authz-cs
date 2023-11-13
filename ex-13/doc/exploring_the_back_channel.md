# Exploring the Back-Channel

In this section we will explore proxying the back-channel (client, api's), that is proxying **outgoing** network traffic from the components. To get **everything** we would have to listen on the network wire.

## General preparation

Steps:

* Get the complete application scenario from ex-11 (Protecting web api's - OBO) up and running
  * The Client
  * The Episodes API
  * The Quotes API
  * Hints:
    * npm install
    * npm test
    * source ... config ...
    * npm start

### -- Now You --

* Do the steps above and verify that the scenario works as expected
  * Login
  * Get Inbox
  * Get List of episodes with quote
  
---

## Preparing the Client

In this section we will prepare the Client (back-end) for proxying. We use NodeJs to program the client. NodeJS has it's quirks of how to make this work, most eco systems has "their own way". Some are happy to pick up the global "https-proxy" environment variables. Some do not, and NodeJS in the latter category.

Our client also has at least three "proxy alternatives" depending on which "request libraries" that are in use.

* MSAL can use multiple http request client's and has in later version been able to be configured to use a http proxy. This is done using the "proxyUrl" param of the client config
* Our client uses [Got](https://github.com/sindresorhus/got/blob/main/documentation/tips.md) which can be configured to used a separate proxy as well.
* Wrapping the whole client using global-agent. Global-agent will work with all libraries that use the Node http.request. (It's also supporting got, axios (used by msal?))

In this exercise we will use the [global-agent](https://github.com/gajus/global-agent).

Steps:

* For the Client code of ex-11 (./ex-11/client)
  * Stop the client if it's running
* Install the global-agent

  ```shell
  npm install global-agent --save-dev
  ```

  We will only install this for development, not production. Using **NPX** we could download and use the module ad-hoc and **keep it out of the project all together**. This would be a good approach.
* We are starting the client using a global-agent boot-strap. By using this pattern we avoid adding any code to our project to handle this scenario.

  ```shell
  export GLOBAL_AGENT_HTTP_PROXY=http://127.0.0.1:8080
  node -r 'global-agent/bootstrap' ./src/server.js
  ```

* Start your application in the web browser
  * Log-in
    * If the login fails, consult the [NodeJS quirks](../../Support/proxy.md#nodejs-quirks) in the Proxy doc.
    * Observe new sites, the request to get token from the back-end
    * Add new sites to the scope in the default context
  * Select "Show Inbox"
    * Observe new sites, the request to the MS Graph
    * Add new sites to the scope in the default context (sites not in the context don't have the bullet-mark on their icon)
  * Select "Show got Episodes"
    * Observe new sites (localhost:3100, the episodes api)
    * Add localhost:3100 to the default context
* Observe the complete flow (network traffic) for
  * login
  * show-inbox
  * show got-episodes
  
### --Now You--

* Do the steps above

---

## Preparing the Episodes Api

In this section we will prepare the Episodes api using the same patterns we used for the Client.

Steps:

* For the Episodes code of ex-11 (./ex-11/got-episodes-api)
  * Stop the api if it's running
* Install the global-agent

  ```shell
  npm install global-agent --save-dev
  ```

* Start the episodes api

  ```shell
  export GLOBAL_AGENT_HTTP_PROXY=http://127.0.0.1:8080
  node -r 'global-agent/bootstrap' ./src/server.js
  ```

* Load your application in the web browser
* Log-in
* Select "Show got Episodes"
  * Observe new sites (localhost:3200, the quotes api)
  * Add localhost:3200 to the default context
* Investigate the request to the quotes api
  * Extract the access token and explore in [jwt.ms](https://jwt.ms)
* Investigate what kind of end-point we are now using at "https://login.microsoftonline.com"

### --Now You--

* Do the steps above

---

## Preparing the Quotes Api

In this section we will prepare the Quotes api using the same patterns we used for the Client.

Steps:

* For the Quotes code of ex-11 (./ex-11/got-quote-api)
  * Stop the api if it's running
* Install the global-agent

  ```shell
  npm install global-agent --save-dev
  ```

* Start the quote api

  ```shell
  export GLOBAL_AGENT_HTTP_PROXY=http://127.0.0.1:8080
  node -r 'global-agent/bootstrap' ./src/server.js
  ```

* Load your application in the web browser
* (Log-in)
* Select "Show got Episodes"
  * Observe the traffic to the Quotes api

### --Now You--

* Do the steps above

---

## Isolating one component

At this point we are capturing all outgoing traffic (hopefully) from all components. Seeing everything at once may be a bit challenging. To "debug" one component, make sure it's the only component that's proxied.

Steps:

* Lets inspect the Episodes api
* Stop the **Client** and start it using **npm start**
* Stop the **Quotes API** and start it using **npm start**
* Start the **Episodes Api** using the proxy approach above
* In your browser, remove the **proxy config** (set it back to normal)
* In Zap
  * Clear the history
  * Filter to only show traffic in Scope
* Load application in web browser (localhost:3000)
  * Login
  * Select "Show GOT Episodes"
  * Observe
    * Request to Azure AD to get keys - '/v2.0/keys' (used to validate JWT token from the Client)
      * Investigate request and response
    * Request to Azure AD to get token for Quotes - '/v2.0/token' (using OBO to get token)
      * Investigate request and response
    * Request to get the quote
      * Investigate request and response
  * Explore tokens in [jwt.ms](https://jwt.ms)

### --Now You--

* Do the steps above

## --Discuss security issues and good practices--

* ZAP logs contains confidential information - be cautious about what you save where and when
* Testing and debugging against a "production Azure AD" may not be the best of ideas?
