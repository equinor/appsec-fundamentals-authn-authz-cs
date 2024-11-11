# Requesting an Authorization Code

At this point we will start the first leg of the OAuth2 Code Grant flow - getting the auth code that we later will use to request a token. We use a small Python program to generate the request and past this into our browser

Steps:

* Let's start by looking at the [auth code flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow) in the documentation of the _Microsoft Identity Platform_
* Open a new terminal window if one is not already available.
* Navigate to the `./ex-01` directory

```shell
cd ex-01
```

* Open and explore `./ex-01/first-leg.py` file in VSCode.
* Update values for the following variables:
  * Your tenant id (`tenant_id`)
  * Your client id (`client_id`)
  * The redirect URI (`redirect_uri`)
* Explore values fro `scope` and `state`
* Prepare the Python environment

```shell
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

* Execute `first-leg.py` and copy the authorization url

```shell
python ./first-leg.py
````

* Paste the url into your browser and execute
  * Using the Browser Web Developer Tools is recommended.
  * Why in the browser?
  * Why the "consent" flow?
  * The code is available in the redirect. It is "use once" within 10 minutes
  * (Depending on the State of your browser you may have to authenticate or not, explore the get request header for cookies)
  * Make a copy of the 'code' parameter in the redirect.
* For additional insight on the complete dance (optional)
  * (This may not work dependent on your compliant device status ⚡️)
  * Open a "private/incognito" window in your browser.
  * Open the Developer Tools
  * Select the option to persist logs
  * Copy the "get request" from VSCode, paste into browser, and execute
  * Explore the browser log, the auth, the 302 redirect to the configured URI containing the code, and the 404 "not found" at the end.

## --Now You--

* Do the steps above.
* When you are done, offer your help to other participants!

## --Discuss security issues and good practices--

* The communication happens in the "front-channel"
* Remember to remove invalid redirect URI's from your app objects
