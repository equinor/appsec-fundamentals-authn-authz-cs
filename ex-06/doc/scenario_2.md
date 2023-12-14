<!-- markdownlint-disable MD034 MD024 -->

# Only defined users and groups should have access

In this section we will protect a web app so that only defined groups (and users) get access. There are multiple ways to implement this!

## Alternative 1 (Sign In)

Alternative 1 is about assigning users/groups directly to the Microsoft Entra ID Object. This happens in Microsoft Entra ID - and it's not about application logic at the client.

This alternative is about the ability to sign-in. This alternative can be used in combination with other alternatives (Defence In Depth)

Use [scenario 1](scenario_1.md)

----

## Alternative 2 (Groups in Token)

Alternative 2 is about getting AD group membership as part of the token claim.

This approach assumes that the user is authenticated and able to sign-in.

This approach has known limitations. The [maximum number of group claims](https://docs.microsoft.com/en-us/azure/active-directory/hybrid/how-to-connect-fed-group-claims#important-caveats-for-this-functionality) in a JWT token is 200. When the user is part of more groups the JWT token will contain a link for querying the Microsoft Graph API.

* The [Application Manifest](https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-app-manifest) defines all attributes and behavior of the app related to Microsoft Entra ID.
  * The App manifest is the master
  * The Microsoft Entra ID GUI are not yet keeping up with whats in the app manifest
  * For adding group membership to the token claim we can use the "Token configuration" -> "Add groups claim"
  
Steps:

* Locate the "Token Configuration" and "Add Groups Claim" in the App Registration
* Select "Security Groups", Save.
* Explore the changes in the manifest.

### --Now You--

(Assuming you use the app from ex-5)

* You may have to start / stop the back-end between changes.
* Do the steps above
* Login to your application and figure out how to observe the changes (Hint: "id token")
* When done - post how many AD groups you are member of into the course Slack channel.

### --Further experiments--

* Do the following experiments (remember to save in AAD and to restart the client back-end between changes)
  * Experiment-1
    * Uncheck "Security Groups" and Check "Groups Assigned to Application"
    * (This will reduce the number of groups included to only be those a user is assigned too - direct or via a AD group)
  * Experiment-2
    * "Emit groups as role claims" for "ID" token
    * (The groups will be in the role claim rather than the group claim)

### --Discuss security issues and good practices--

* Exploring [ID Tokens](https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens) and [Access Tokens](https://docs.microsoft.com/en-us/azure/active-directory/develop/access-tokens) on the Microsoft Identity Platform will be important to understand whats ending up in which type token and what's available of [optional claims](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-optional-claims).

----

## Alternative 3 (Using the MS Graph)

This approach assumes that the user is authenticated and able to sign-in.

### Option 1 (all users)

Option 1 is about reading information about all group memberships from the Microsoft Graph. This alternative is quite easy to implement - but it comes with at least one issue - it usually requires a wide set of permissions - the ability to read group membership for all signed in users. Few applications will get this in Equinor (ref. the [API Permissions fro Graph API](https://docs.omnia.equinor.com/governance/iam/App-Admin-Consent/#api-permissions-for-graph-api))

### Option 2 (user consent, specific user)

Option 2 is using delegated permissions "GroupMember.Read.All". Delegated means reading on behalf of the logged in user. This permission can then be used to list group the user is part of. This permission must be admin consented.

----

## Alternative 4 (App Roles)

This approach assumes that the user is authenticated and able to sign-in.

Application roles can be used to implement role based access (rbac). The general idea is that you define application roles and assigns user and groups (and applications) to app roles. When configured information on app roles a user is connected to is then included in the _roles_ claim of a token. Which token ([access](https://docs.microsoft.com/en-us/azure/active-directory/develop/access-tokens#payload-claims), [id](https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#payload-claims)) that will contain the _roles_ claim is defined by the OAuth2 grant that was used. The _roles_ claim could be used to drive parts of the authorization in application logic. **Using app roles is usually the preferred option**

App roles can be defined in two ways, either using the "[App Roles UI](https://docs.microsoft.com/nb-no/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps#app-roles-ui)" of in the "[App manifest Editor](https://docs.microsoft.com/nb-no/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps#app-manifest-editor)"

App roles can be assigned to user and groups and the applications.

Steps:

* For your client's App Registration - use "App Roles UI" to
  * create a new app role
  * Display name "Writers"
  * Allow "Users, Groups and Applications"
  * Value "app.write"
  * Description "Writer than can write"
  * Enable the app role
* Identify the new role in the App Manifest (the "appRoles" key)
* Assign yourself this role in the Enterprise Applications for your client
  * "Users and groups"
  * (Some time it may take a minute until the app role is available)
* Login to your application

### --Now You--

(Assuming you use the app from ex-5)

* Do the steps above
* Identify the roles claim in the proper token (this step may involve altering the backend app code)
* Explore the possible payload claims for [access tokens](https://docs.microsoft.com/en-us/azure/active-directory/develop/access-tokens#payload-claims) and [id tokens](https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#payload-claims)

## --Discuss security issues and good practices--

* Did you observe the usage of app roles in our client application?
  * Who is responsible for validating the Id token?
  * Is it preferable to render gui logic on the back-end?
  * We could do logic in the front-end, but stuff should always be verified by the back-end as well?
* From an architecture view alternative using app roles would be a preferred approach. All logic related to groups, group-id etc are moved out of the application which only is concerned about roles. This means that groups, memberships etc will be handled outside the application code - which in most cases is a good pattern. (This will be quite obvious when we start challenge testability and move testing over to different Microsoft Entra ID tenant later)
* **What if we want to send the app roles to API's?**</br> In our example we received the app roles in the ID token. What about getting the app roles into API's to drive business logic? This entirely possible. Add the necessary app roles to the API's AAD object. [Assign users / groups to the app role](https://learn.microsoft.com/nb-no/azure/active-directory/develop/howto-add-app-roles-in-apps#assign-users-and-groups-to-roles) by using the "Enterprise application" version of the API AAD object. The app roles claim will now be part of the access token that is provided to access the api. Read more on the topic in [MS Identity platform](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-add-app-roles-in-apps#usage-scenario-of-app-roles) (Adding groups is also possible)

----

## Alternative 5 (Scope)

Scope is not discussed in this context - it's been mentioned earlier. Scope can of course be used to handle permission and access. Scope can be delegated (on behalf of a user,) and consented/granted by the user - or an admin. Scope can also be of type application - the application (Application Registration Object) is givens permission to the scope.

Permissions through scope is done by requesting scope in the OAuth dance and it is represented in the scope claim of an access tokens. It's up to the application code in the resource server, typically an api, to implement the actual permissions in relation to the data it aiming to protect.

We will explore api's and permission in scope when we discuss protecting api's.
