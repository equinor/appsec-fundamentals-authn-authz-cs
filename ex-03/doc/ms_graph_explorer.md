# The Microsoft Graph Explorer

The purpose of this section is to use the tool Microsoft Graph Explorer to explore scopes and permission.

Steps:

* Open the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
* Sign in using your Equinor account
* Query `/v1.0/me`
* Explore
  * Permissions tab
  * Access token (extract access token and explore in [jwt.ms](https://jwt.ms))
  * Response preview
* Query `/v1.0/me/memberOf`
* Explore
  * Permissions tab
  * Response preview
* Query `v1.0/me/mailFolders('Inbox')/messages?$select=sender,subject`
* Explore
  * Permissions tab
  * Response preview
* Take a look at the [Graph Api Documentation](https://docs.microsoft.com/nb-no/graph/api/overview?view=graph-rest-1.0)
* Explore other parts of the Graph API, explore response and permissions



## --Now You--

* Do the steps above
* Find the answer to the following questions
  * What permissions have you granted to the Graph Explorer?
  * What permissions is granted by the admin on your behalf for the graph explorer?
  * (Hints: Token, Microsoft Entra ID)

