# Application Security Fundamentals - Authn & Authz

[![License](https://shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) 
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](/CONTRIBUTING.md)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md) 

This is a **hands-on** AppSec fundamentals workshop where we explore protecting API's and Web apps. We look at authentication (authn), authorization (authz) and friends. This version of the workshop is the **Codespaces** edition. Using you browser we run all exercises in a _all inclusive_ virtual environment.

In the workshop participant will get to know key technologies such as OAuth2, OpenID Connect (OIDC) and Microsoft Entra ID. Our journey will take us from the rfc specifications, to manual request, to coding, to using frameworks, to debugging and to testing. After the workshop participants should have a pretty good understanding of the mechanics behind the scenes as well as relevant security/privacy concerns.

* The workshop level is intermediate/advanced.
* The workshop is usually executed as a virtual session (using MS Teams or similar)
* The workshop will be organized as 2 full days sessions
* It recommended that more than one person participate from a team.
* During the workshop we expect to spark a high number of relevant discussions. These discussion should naturally continue in the teams after the workshop.

## Workshop outline

* Intro, objectives
* **What problem** are we trying to solve?
* The basics of Authentication and Authorization (part 1)
* **OAuth2** Code Grant Raw Style
* Getting access tokens using code
* The basics of Authentication and Authorization (part 2)
* Exploring **Scope**
* Exploring **Frameworks** for Authentication and Authorization
* Exploring **Sessions** and session management
* Exploring **Common** authorization scenarios in Equinor
* Exploring **Refresh** tokens
* Exploring The **Implicit grant** for Native, Mobile, SPA
* Exploring **PKCE** for Native, Mobile, SPA
* Exploring Web **API's** protection
* Exploring Web **API chaining** scenarios (OBO)


## Exercise index

1. [Authorization Code Grant Raw Style](ex-01/readme.md)
2. [Getting an access token using code](ex-02/readme.md)
3. [Scope](ex-03/readme.md)
4. [Using Auth Frameworks](ex-04/readme.md)
5. [Sessions](ex-05/readme.md)
6. [Common Authorization Scenarios](ex-06/readme.md)
7. [Refresh tokens](ex-07/readme.md)
8. [Implicit grant](ex-08/readme.md)
9. [Auth Code Grant with PKCE](ex-09/readme.md)
10. [Protecting Web Api's](ex-10/readme.md)
11. [Protecting Web Api's O-B-O](ex-11/readme.md)

## Documentation and Slide deck

Most of the topics and exercises have documentation as part of the exercise. We use a slide deck for some parts. The [docs/readme](docs/readme.md) shows you how to load the docs in your local environment. Slides are also served using Github Pages at [https://equinor.github.io/appsec-fundamentals-authn-authz-cs](https://equinor.github.io/appsec-fundamentals-authn-authz-cs)

## Support documents

* [Frequently Asked Questions](Support/faq.md)
  
## Workshop Preparations and Pre-Requisites

To enable a good flow and outcome of the workshop it is vital to come prepared. Preparations and pre-requisites are defined in [Support/workshop_preparations](Support/workshop_preparations.md)

## Non Equinor adaptions ⚡️

Some of the material in the workshop may not make sense for all environments and may be a bit specific for Equinor. We have marked this with a ⚡️ which indicate that it most likely will have to be adapted to your context.