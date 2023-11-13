# Configure the App for O365

In this section we will configure our app to use the Off365 developer subscription. This involved pretty much the same steps you have done already towards the Equinor Azure AD.

All this click-ops work with defining and maintaining the config object and the .env files is boring and error-prone. It's also a security risk both having this config laying around, mixing up environments and so on. All our developer genes says "script it"! - so that's what we'll do.

Head over to [src](../../src/readme.md) to get started with the scripting.

----

## --Now You--

* Run the scripts to create the necessary AAD object in the O365 Developer AAD.
* Verify the .env files (focus on token cache file location)

### --For the Client--

* Navigate to `./ex-14/client`
* Source the proper .env file
* Install NodeJS dependencies
* Run tests
* Start the client application
* From the browser, login using the "admin" user (Don't give concent on behalf of the organisation)
* Test that the "Show inbox" feature works.
  
### --For the Episodes API--

* Navigate to `./ex-14/got-episodes-api`
* Source the proper .env file
* Install NodeJS dependencies
* Run tests
* Start the api application
* From a browser verify that the Swagger documentation is available (The /doc api endpoint)
* From the browser, test that the "Snow GOT Episodes work" (all expect the quote)

### --For the Quote API--

* Navigate to `./ex-14/got-quote-api`
* Source the proper .env file
* Install NodeJS dependencies
* Run tests
* Start the api application
* From a browser verify that the Swagger documentation is available (The /doc api endpoint)
* From the browser, test that the "Snow GOT Episodes work" - including the quote at the end.

### --Discuss security issues and good practices--

* We now have a working scenario using the Off365 subscription, there is a lot of moving parts and it will get worse
* A good practice would be to move most config out of the env files and into KeyVaults
* Discuss what the complexity of config, different environments, different Azure tenants means for developers
  * Risks
  * Opportunities
* Visit [Permissions and Consent](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent) for a refresher.
  * We are using Application Permissions for Episodes/Quotes api.
  * How would we use delegated permission - user consent?
    * Static consent (we should in most cases avoid this?)
    * Incremental and Dynamic consent (is what we would like to use)
    * ([Requesting individual user consent](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#requesting-individual-user-consent))
