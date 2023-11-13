<!-- markdownlint-disable MD024 MD034 -->

# Putting the app in test mode

In this section we will explore putting our app in test mode.

One of the primary challenges around the testing with A&A turned on is the user account and potential MFA etc. We will:

* Prepare a tester user (if needed)
* Do a manual login and consent
* Explore how "the test aware code" differs from test to prod mode.

---

## Preparing the Test User

This step assumes that you have added the user sample data pack to your Off365 Subscription manually or automatic. This step is only needed if you have forgotten the password for the test user.

Steps:

* Using you Off365 Subscription admin account
  * If you are prompted to turn on MFA for test users, skip this step.
* In Azure Select the "Users" Experience ([link](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/MsGraphUsers))
* Identify the test user "Adele Vance"
  * Note the principal user name (AdeleV@your-organisation.onmicrosoft.com)
  * "Reset password" for the test user - make a note of the temporary password.
* Open a "incognito" window on your browser
  * Sign in the test user to [portal.azure.com](https://portal.azure.com)
  * Enter old and new password. Make a note of the new password
* Depending on your tenant set-up you may have to tick off "security defaults"
  * Information on [Security Defaults](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/concept-fundamentals-security-defaults)
  * Security Defaults is a good thing which we should use. We decide to disable it for the automated testing part to avoid MFA for our test users.
  * In a "real life" scenario with testing for teams we recommend setting up "Conditional access" for the scope that is defined by "Secure Default", and then excluding the test users from MFA. We don't show how to do this in the course due to time constraints.
  * A good starting point for conditional access would be
    * Require MFA for admins
    * Require multi factor authentication for Azure management
    * Block legacy authentication
    * ("Require MFA for all users" - and the disable for selected users)
  * Verify that "Security Defaults" are disabled (Azure AD -> Properties -> Manage Security Defaults)
  
### --Now You--

* Do the steps above.

---

## Manual login and consent

* Start the application with current config (client, episodes api, quotes api)
  * Login using the test user
  * Give Consent
* Verify that
  * "Show inbox" works
  * "Show GOT Episodes" works

### --Now You--

* Do the steps above.

---

## Explore Code, Config and Run

We have made a "small" change to the client code which makes it behave differently in test than prod. This is the only change to code in our scenario to handle the test case.

Steps:

* Explore './ex-14/client/src/app.js' - app.get('login'....)
  * If the environment variable NODE_ENV = test the code will use a special login procedure
* Explore './ex-14/client/lib/auth-utils.js' - authenticateForTest
  * The function read a username and password from the environment and
  * Uses MSAL and the ROPC grant to request tokens and create the session objects
* The effect when in test mode is - the test user is automatically logged in.
* Update the Client Config
  * Add values to the '(your initials)-appsec-course-Client-development.env ' file
  
    ```shell
    export TEST_CLIENT_USERNAME=''
    export TEST_CLIENT_PASSWORD=''
    ```

* Stop the client if it's running
* Source the updated config file
* Put the client in test mode

  ```shell
  export NODE_ENV=test
  ```

* Start the client

  ```shell
  npm start
  ```

* Use the application and log in
* Verify that Adele is logged in and that stuff works (there should be no prompt for credentials or concent)

### --Now You--

* Do the steps above.

## --Discuss security issues and good practices--

At this stage we have a good starting point for automating further testing - driving from the Browser

* Are there any obvious security risks with this pattern?
* Discuss pros / cons for this pattern
