# Register an App Object in Azure AD

We need a trusted 3rd party between the user/client and the protected resource - the Authorization Sever. In our context this is Azure AD.

We need an application object which will represent our application.

Steps:

* Investigate the Omnia general principles for the [AAD app objects](https://docs.omnia.equinor.com/governance/iam/App-General-Info/) ⚡️
* Navigate to [portal.azure.com](https://portal.azure.com)
* Activate your _Application Developer role_ in _Azure AD Privileged Identity Management_ ⚡️
  * _My roles_ -> _Azure AD Roles_ -> _Application Developer_ -> _Activate_
  * Be patient - it may take a minute ...
* Select _Azure Active Directory_ from the Azure Portal Home page
* Select _App Registrations_
* Register your personal application with the following properties:
  * Name: "(your initial)-appsec-course-client" (example: "johnd-appsec-course-client")
  * Type: Single tenant
* Augment app object to be compliant
  * Add an additional owner (select course instructor) (Owners)
  * Update the "service management reference" to refer to the "AppSec-Training" - 119775 (Branding & Properties) ⚡️
* Register a client secret for your application (In 'Certificates and Secrets')
  * Expire: 7 days
  * Make a note of the secret value
* Register a redirect uri for your `Web` application (In 'Authentication', Platform Configuration)

```
 echo 'https://'$CODESPACE_NAME'-3000.'$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN'/'

https://solid-invention-pjrjqqpjvxx29pgw-3000.app.github.dev/
```


  * 'http://localhost/myapp/'
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

* Do the steps

When you are done:

* Post a message to the [appsec-fundamentals-authn-authz](https://equinor.slack.com/archives/C051G3JV7NE) Slack channel and include the "oAuth 2.0 Authorization endpoint (v2)" for your application ⚡️
