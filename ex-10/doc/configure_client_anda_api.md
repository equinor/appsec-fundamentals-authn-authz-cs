# Configuring the Client and the Episodes API

In this part we will start to investigate how to prepare the configuration for both the client and the api.

The readme.md file for both component include the basic information on which configuration variables the app need in order to run. The code contain information on default values used when the configuration it not available ('./lib/app-config.js')

---

## The Client

### Environment config

For the client you have already crated a **.env** file that contains the basic configuration (~/path-to-env-file/appsec-course-client-eq.env). We need to add an additional variable for the MSAL token cache. This file now should hold the following environment parameters:

```shell
export NODE_ENV=development
 export CLIENT_SECRET='the client secret from the AD app object'
export CLIENT_ID="the client id from the AD app object"
export TENANT_ID="then tenant id"
export PORT=3000
export TOKEN_CACHE_FILE="${HOME}/.tcache/cache.json"
```
### Additional config

Additional config are defined in './lib/app-config.js'. Config that should be verified are:

* gotApiUrl (where to look for the  got episodes api)
* scopes.gotApi (the scope definition)

### Steps:

* Update the scope.gotApi in msalConfig to contain the value of the scope for your api
  * Hint: Microsoft Entra ID -> App Registrations -> (initials)-appsec-course-episodes-api -> Expose and Api -> Scopes

### --Now you--

* Verify the config on the appsec-course-client-eq.env file
  * Remember to create the directory that should host your MSAL token cache
* Do the step above and update the value of scope.gotApi (remember to save)

---

## The Episodes Api

### The App and the Environment
The Episodes API follows the same pattern as the client application, it uses config from the environment and some in the code.

Steps:

* Create a new **.env** file for the api config. Give it the name **appsec-course-api-episodes-eq.env**
  * This file should be kept out of version control and out of the source code folders! Store it in the same location as the config file for the client.
* Add the following config to the .env file
  ```shell
  export NODE_ENV=development
  export TENANT_ID="3aa4a235-b6e2-48d5-9195-7fcf05b459b0"
  export PORT=3100
  ```
* In './ex-10/got-episodes-api/lib/app-config.js'
  * Update the value of apiAudience (the Application ID URI for your api)
    * Hint: App Registrations -> (initials)-appsec-course-episodes-api -> Expose and Api -> Application ID URI
    * Remember to save the change

### Microsoft Entra ID

We have created and app registration for our episodes api. We have also created a scope that is exposed by this api. The typical next steps would be that users, or an admin on behalf of an organization, would give consent to this scope for a client.

For our set-up we are using the second option, we are authorizing a client application to use the api. This indicates that our api trust the Client - and that users will not be asked for any consent when the client calls this api. For our scenario this makes sense. There is no user specific data exposed by the api.

There is also an Equinor configenc that makes the solution above interesting; admin consent is needed for all scope. When the admin has made the consent it is applied for all end-users, and the end-users cannot change/remove the consent. To trigger a user consent in our code, we would have to update the app to send a consent [request](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#requesting-individual-user-consent) to the **authorize** end-point for the Episodes.Read scope for the client

Steps:

* Enter [Portal.azure.com](https://portal.azure.com) - select "Azure Active Directory"
* Select "App Registrations" and then select your api.
* Select "Expose and API"
* Select "Add a client application", enter the "application id" for you CLIENT and give access to the Episodes.Read scope.

### --Now you--

* Do the steps above for "The App and the Environment"
* Do the steps above for "Microsoft Entra ID"

## --Discuss security issues and good practices--

* Good practice: In your team - define a strategy for how to handle config, what needs to be defined outside the application (outside version control) and what may live inside (and the criteria for what goes where). 
* Good practice: Consider using components/modules to read config and make it available to the application (like [dotenv](https://www.npmjs.com/package/dotenv) for NodeJs)
* Discuss: When does it make sense to script Microsoft Entra ID App registrations?
