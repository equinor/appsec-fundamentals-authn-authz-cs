# Permissions and consent

In this part we will re-visit the permissions and consent in Microsoft Entra ID

## --Review--

* Review the doc for [Permissions and consent in the Microsoft identity platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent)
  * Scope = Requested Permission
* Permission types
  * Delegated permissions - for signed in user - consented by user or admin on behalf of organization
  * Application permissions - for machines/systems with no signed in user - admin consent only
* Effective permission
  * For delegated permissions - the least-privileged between the app and the signed in user. Never more permissions than the signed in user. <br/>(Example: App has User.ReadWriteAll, signed in user has no admin - so the effective rights will be to edit own user only)
  * For app permissions - the full privilege of the assigned permissions (Example: App has User.ReadWriteAll - app will be able to update user info for all users in the tenant)
* Equinor [Application Management in Microsoft Entra ID](https://docs.omnia.equinor.com/governance/iam/App-General-Info/)⚡️
  *  Add an additional owner to AppReg and to the Enterprise App (select course instructor) (Owners)⚡️
  *  Add "service management reference" (AppSec Training, 119775)⚡️
  *  Naming
  *  API Permissions require admin consent!!⚡️
     *  When you have the "Application Developer Role" active you will often be able to consent on own-behalf
     *  Side-effect: The first user that uses your application will have to request access. When/if this is approved by an admin - it's done to the whole org so no other users will be asked to consent
  *  Application permissions will have to be defined for the application (Api Permission) as Static (Configured Permission) and granted by Admin. 
  *  For scope that we (our client expose, we can use "Expose an api" and authorize client applications without going though the admin concent)
    * Why do we have a set-up where admin concent is needed?
      * oAuth based phishing attacks and the general behavior of "click-ing OK on all requests" are a few. ([Consent Phishing Attack](https://www.microsoft.com/security/blog/2021/07/14/microsoft-delivers-comprehensive-solution-to-battle-rise-in-consent-phishing-emails/), [Tweet on recent Consent Phishing attack](https://twitter.com/MsftSecIntel/status/1484623341155610624))

## --Now You--

* For your application (client). Identify
  * What permissions are configured for the application?
  * What permissions are consented for the application? <br/>Hint: Enterprise Applications
* By exploring the code for ex-2, identify where
  * The scope is defined
  * How the scope is used when requesting an access token
  * How the access token is used when reading the inbox content


## --Discuss security issues and good practices--

* What security risks does the pattern of admin consent on all api scope introduce?
* Good practice: Request scope dynamically - don't include all scope/permission in one single token
* Good practice: Scope and permissions should be reviewed on regular intervals - both the config and what's actually granted.
