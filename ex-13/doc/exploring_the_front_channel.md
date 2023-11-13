# Exploring the Front-Channel

In this section we will explore proxying the front-channel (user-agent, browser)

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
  

## Preparing the user-agent (browser)

In this section we will configure the proxy setting in our browser as well as adding ZAP's self-signed root CA to the browsers trust store.

Steps:

* Enter browsers setting page
  * Find the certificates store
  * Import the "owasp_zap_root_ca.cer" file
* Still in setting the proxy config
* Configure manual proxy settings
  * Http proxy: **127.0.0.1** - port **8080** 
  * Https proxy: **127.0.0.1** - port **8080** 
* Open the ex-11 application, do a
  * (Logout)
  * Login
  * Show In-Box
* Observe that
  * Only traffic to **microsoft** (msauth.net and login.microsoftonline.com) are captured by ZAP
  * This is ok
    * Most browser won't by default proxy traffic to localhost - it's seen as a potential hijack attempt (man in the middle again). 
    * Settings can be turned off in the browsers to circumvent this - we will not do this. Will capture this traffic later from the perspective of the client back-end.
  * Traffic to get your inbox is not captured by Zap. This traffic happens outside the browser.
* You may also observe that a lot of other traffic starts to show-up in Zap. This could be the browser/plugins that are "chatty".
* We will create a context and scope in ZAP to only include traffic we want to see
* In "Sites", Select and then right-click and "Include in context" - the default context
  * https://login.microsoftonline.com
* In "Sites" and "History" - select the icon to only show urls in context
  * Test turning this on/off



## --Now You--

* Do the steps above
* Experiment with browsing to other sites, perhaps with a login to observe what happens and to give you a general idea of the power of proxying.

## --Discuss security issues and good practices--

* A good strategy for documenting which settings are alters in the browser to make proxying work will be smart.
* A good strategy for cleaning up is also smart"

