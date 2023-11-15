# The Example App and Code

We have have created and example application, a cli, that we use to explain Device Code Grant.

## The Application

* Our application is a CLI which prints your name based on whats stored in the MS Graph.
* The Basic flow is as follow:
  * Start up and prepare config
  * Try to get an access token from the cache
  * If no token from cache - get one using Device Code Grant
    * The app will share a url and a code which the user will have to enter using a browser.
  * Read your **displayName** and **email** from the o365 graph and print values to the terminal
  
## The Code

Steps:

* Investigate 'index.js' (kicks off the app)
* Investigate './lib/app.js' (load config and process the request)
* Investigate './lib/cli-config' (load, prepare and build config)
* Investigate './lib/msal-utils' (wrapping MSAL and requests a token silently or by device code)
* Investigate './lib/graph-utils' (reads information from the MS graph)
* Investigate tests ('./test')

### ---Now You--

* Spend some minutes exploring the steps above and make yourself familiar with the code

---

## Configuration

In order to make the app run we need to prepare to sets of configuration. We need to create an Microsoft Entra ID object representing the client and we need to create some environment config driving the app.

### Microsoft Entra ID

Steps:

* Create a new Microsoft Entra ID App Registration for the CLI app
  * Hint: Remember to active the Application Developer role in PM
* Important parameters
  * Name: **(initial)-appsec-course-cli**
  * Allow public client flows: App registration -> Authentication -> Allow Public Client Flows -> Yes (and save)

### ---Now You--

* Do the Steps above and create the entry for your app
* Make a note of the tenantid and clientid

---
### The Environment

Steps:

* The client expects the following environment variables to run

  ```shell
  export NODE_ENV=production
  export TENANT_ID=""
  export CLIENT_ID=""
  export TOKEN_CACHE_FILE="${HOME}/.tcache/cache.json"
  ```

* Create a new .env file to hold these parameters.
* Add the proper values for client id and and tenant id.
* Name the file 'appsec-course-cli-eq.env'

For Windows users on Gitbash; please note the path for the TOKEN_CACHE_FILE. This should work on Gitbash as long as the MSYS_NO_PATHCONV variable is not set. Alternatively; use Windows notation for the variable (```export TOKEN_CACHE_FILE="c:\users\userid\.tcache\cache.json```). Consult the [FAQ](../../Support/faq.md) for more information on this topic.

### ---Now You--

* Do the steps above and create the .env file for the app.

Most CLI's store config in dedicated config files. They will also allow environment variables to take precedence if they exists.

### Discussion: Securing the Token Cache

In our example we store the token cache on local disk, un-encrypted. This is not a *production* pattern! The token cache should be encrypted!

For NodeJS, Microsoft has an additional library, the [Microsoft Authentication Extensions for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/extensions/msal-node-extensions). This library offers secure mechanisms for `public client` applications to perform cross-platform token cache serialization and persistence. It gives additional support to the Microsoft Authentication Library for Node (MSAL).

Supported platforms are Windows, Mac and Linux:

* Windows - DPAPI is used for encryption.
* MAC - The MAC KeyChain is used.
* Linux - LibSecret is used for storing to "Secret Service".

For production code, this or similar libraries should be used.