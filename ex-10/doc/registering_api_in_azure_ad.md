# Register the API in Microsoft Entra ID

The purpose of this part is to register an Microsoft Entra ID app for our API. This enables us to use Microsoft Entra ID to help protecting the API.

After this part we have two object in Microsoft Entra ID, one for the client, and one for the episodes api.


Steps:
* Navigate to [portal.azure.com](https://portal.azure.com)
* Activate your _Application Developer role_ in _Microsoft Entra ID Privileged Identity Management_ ⚡️
  * _My roles_ -> _Microsoft Entra Roles_ -> _Application Developer_ -> _Activate_ 
  * Be patient - it may take a minute ...
* Select _Microsoft Entra  ID_ from the Azure Portal Home page
* Select _App Registrations_
* Register your application with the following properties:
  * Name: "(your initial)-appsec-course-episodes-api" (example: "johnd-appsec-course-episodes-api")
  * Type: Single tenant
* Augment app object to be compliant ⚡️
  * Add an additional owner (select course instructor) (Owners) ⚡️
  * Update the "service management reference" to refer to the "AppSec-Training" - 119775 (Branding & Properties)⚡️
* Select the _Expose an API_ in the left side menu
* Add new scope
  * Use the suggested **Application ID URI**, save and continue
  * Scope name: **Episodes.Read**
  * Who can consent?: **Admins and users**
  * Admin consent display name: **Episodes.Read**
  * Admin consent description: **Read GOT Episodes**
  * User consent display name: **Episodes.Read**
  * User consent description: **Read GOT Episodes**
  * State: **Enabled**
  * Select "Add Scope"
* Select the _API Permissions_ in the left side menu
  * Defines API's permissions given to api (admin or user)
  * Remove default "User.Read" permissions.

## --Now You--

* Do the steps above
* When done; post a message to the course Slack channel and include your api's scope (api://..../...)

