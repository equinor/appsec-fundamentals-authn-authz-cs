<!-- markdownlint-disable MD034 -->

# The Office 365 Developer Account

In this section we will explore the parts of the Office365 developer account that we will use for the remainder of the course. That is, we assume you have registered your own account as part of the course preparations ([o365 how-to](../../Support/o365_dev_howto.md))

Steps:

* Navigate to the [Microsoft 365 Dev Center](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
* Sign-in using the account you used to register (example: your_shortname@equinor.com)
* Navigate to the Dashboard ("Developer Program -> My Dashboard") ([link](https://developer.microsoft.com/en-us/microsoft-365/profile))
* You should have
  * A domain name (example: "cyclingpower.onmicrosoft.com" )
  * A renewable E5 Subscription
  * A admin account at your domain (example: lars.kaare@cyclingpower.com)
    * Official account in example would be lars.kaare@cyclingpower.onmicrosoft.com
  * Some days left on the subscription
  * Registered users (the Users sample pack should have been loaded)
* Select "Got to subscription"
  * Manual for example would be "https://www.office.com/login?login_hint=lars.kaare@cyclingpower.onmicrosoft.com
* Log-in to your domain/subscription admin account
* Select the "App Icon" (top left) and then "Admin"
  * Login using your domain/subscription admin account
  * [The Admin Portal - https://admin.microsoft.com/Adminportal/](https://admin.microsoft.com/Adminportal/)
* In the admin portal - expand if necessary and select "Azure Active Directory
  * Alternatively, browse to [https://aad.portal.azure.com](https://aad.portal.azure.com) and log-in using your admin account
* We will use this to work with Azure AD app registrations and users
* Select "All Services" and "Azure Active Directory"
* This will be the similar experience to what you have at Equinor, with more options and less limitations since you are an admin.

## --Now You--

* Do the steps above.
* Post the name of your "domain" to the course Slack channel

## --Discuss security issues and good practices--

* The Off365 subscription is different from the Equinor one (groups, users, limitation)
  * Discuss challenges and opportunities
* You are an admin at the Off365 subscription
  * Discuss risks and opportunities
* The Off365 subscription is a personal account
  * Discuss challenges and opportunities
* The Off365 subscription does not have a trust relationship to the our official Azure AD
  * Discuss challenges and opportunities
