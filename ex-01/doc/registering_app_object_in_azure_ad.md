# Register an App Object in Azure AD

We need a trusted 3rd party between the user/client and the protected resource - the Authorization Sever. In our context this is Azure AD.

We need an application object which will represent our application.

Steps:

* Investigate the Omnia general principles for the [AAD app objects](https://docs.omnia.equinor.com/governance/iam/App-General-Info/) ⚡️
* Navigate to [portal.azure.com](https://portal.azure.com)
* Activate your _Application Developer role_ in _Microsoft Entra Privileged Identity Management_ ⚡️
  * _My roles_ -> Entra Roles -> _Application Developer_ -> _Activate_
  * Be patient - it may take a minute ...
* Select _Microsoft Entra ID_ from the Azure Portal Home page
* Select _App Registrations_
* Register your personal application with the following properties:
  * Name: "(your initial)-appsec-course-client" (example: "johnd-appsec-course-client")
  * Type: Single tenant
* Augment app objects to be compliant ⚡️
  * Add an additional owner to AppReg and to the Enterprise App (select course instructor) (Owners)
  * Update the "service management reference" to refer to the "AppSec-Training" - 119775 (Branding & Properties) 
* Register a redirect uri for your `Web` application (In 'Authentication', Platform Configuration)
  * Use the following command from a terminal window in CodeSpaces to get your redirect uri

    ```shell
    echo 'https://'$CODESPACE_NAME'-3000.'$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN'/'callback
    ```

  * Please note that the redirect uri will be different for each Codespace.
* Explore the various attributes for your new app object
  * Overview, EndPoints
  * Authentication
  * Certificates & Secrets
  * Token Configuration
  * API Permission (The permissions grant to your app object)
  * Expose API  (Scopes defines by you app, other apps/client than can access)
  * App Roles
  * Manifest
  
## --Now You--

* Do the steps, register the app object

* Post a message to the [appsec-fundamentals-authn-authz](https://equinor.slack.com/archives/C051G3JV7NE) Slack channel and include the "OAuth 2.0 Authorization endpoint (v2)" for your application ⚡️


## Registering the client secret

The client need to authenticate itself with the Authorization Server (MS Entra ID). For this it uses a client secret.

Steps:

* Verify that you are using Zsh as shell in your CS terminal window
  * Look for the `>zsh` in the upper right corner area of you CS terminal
  * Running `echo $0` should emit `/usr/bin/zsh`
* Register a client secret for your application (In 'Certificates and Secrets')
  * Expire: 7 days
  * Copy the secret value (not the secret id)
* Execute the following command to persist the client secret as a "Github Codespaces User Secret"</br>Typing "aa-" and then pressing "tab" should help, we have file completion in the terminal.

    ```shell
    aa-save-client-secret.sh
    ```

  * When asked for by the script, paste the value of the client secret
  * Select "Reload to Apply" when the message on "Your Codespace Secrets have changed" pops-up.
* Verify that the client secret is available in the CS environment
  * Examine the Github Codespaces Config for you Github profile at [https://github.com/settings/codespaces](https://github.com/settings/codespaces)
  * You should find the "APPSEC_AA_CLIENT_SECRET" and it should be connected to 1 repo
  * Execute the following script to output the value secret into your terminal

    ```shell
    echo $APPSEC_AA_CLIENT_SECRET
    ```
  * (If the GH CS user secret is not available, run the "aa-save-client-secret.sh" script again)
  
## --Now You--

* Do the steps