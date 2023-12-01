# Only people with a valid account should be able to sign-in

In this section we will protect a web app so that only users that are able to authenticate with a valid account get access. This is about the ability to sign-in, not permissions inside the application itself. In relation to OAuth2 - this is where the "Authorization Server" hands over work to the "Authentication Server" - which is not a concern of OAuth2.

Steps:

## App Registrations vs. Enterprise Applications

One analogy that could make sense to understand these two are; app registrations are like an object definition while the enterprise application is one instance of that object. Remember apps could be "multi tenant" - meaning that there would be instances in different Microsoft Entra ID tenants.

## Configuration

Steps:

* From Microsoft Entra ID, select Enterprise Applications
* Search for your client application (INTIAL-appsec-course-client)
* Select **Properties** on the left side menu
* Observe
  * "Enables for users to sign-in?" (read info)
  * "User assignment required?"
* App available to users with valid account = "Sign in enabled"
  * Available to everyone with a valid account in tenant
* App available to specific users and groups = "Sign in enabled" + "User assignment required"
* In the "Enterprise applications" registration for an app, observe
  * Sign-in logs
  * Usage and insight
  * Audit Logs
* Select **Users and groups** on the left side menu
  * This is where users and groups are assigned to the application
  * (AD groups are synced from on-prem AD) ⚡️

## --Now You--

(Assuming that you have the application in ex-5 running)<br/>
(You may have to restart the client back-end between changes)

* Explore the steps above
* Configure the Enterprise Application object for your client and observe changes
  * Disable sign-in
    * Test => Not able to sign-in
  * Enable "user assignment required"
    * Remove yourself from assigned users
    * Test => Not able to get access token, not able to sign-in
  * Add yourself to assigned users
    * Test => Able to sign in
  * "Sign-in" should be enabled, "Assignment required" should be disabled.
    * Test => Able to sign in.

## --Security considerations--

* Valid account means all accounts in the Microsoft Entra ID tenant, not only "employees". It could be externals, guests accounts or similar.
* Be aware of security considerations for multi tenant applications ([MS Guidance](https://msrc.microsoft.com/blog/2023/03/guidance-on-potential-misconfiguration-of-authorization-of-multi-tenant-applications-that-use-azure-ad/))
