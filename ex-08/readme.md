# EX-8 - Implicit grant (🥸)

In this section we will briefly discuss the OAuth2 Implicit Grant. It may be important to understand from a legacy perspective.

## OAuth2 Implicit grant

(Presented in Slide deck)

### Highlights

* Implicit grant was previously recommended for SPA', Native and Mobile apps (public clients)
* It should be treated as legacy and be avoided
  * Consult [OAuth2 Security Best Current Practice](https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/17/) on Implicit grant.
* Implicit is replaced by Authorization Code Flow with Proof Key for Code Exchange (PKCE)
* The same goes for OIDC Implicit Flow - it is going to be deprecated.

## SPA

Single Page Application are application that are running in the web browser. Their key characteristics is that they re-write the [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) rather than refreshing web pages.

There are at least to architectural models:

* Web Browser (user agent) only. 
  * The complete app resides in the browser.
  * All communication happens in browser
  * In OAuth2 terms, the Client is the browser.
  * This is a public client
* Hybrid (Back-end for front-end pattern)
  * The web application communicates to a dedicated back-end which operates as the client which then handles external communication
  * Parts of app logic in back-end
  * In OAuth2 terms, the back-end is a confidential client

## Configuring Microsoft Entra ID for Implicit grant

Steps:

* For the client app, open Microsoft Entra ID App Registration
* Explore the "Authentication" options
  * "Implicit grant and hybrid flows"

## --Now You--

* Do the steps above

## --Discuss security issues and good practices--

* Good practice: Don't use the "Implicit grant" for new development work (also goes for OIDC)
* Good practice: Migrate away from "Implicit grant" for existing apps (also goes for OIDC)
* Good practice: The hybrid model (SPA supported by own back-end, BFF pattern) is the most secure?
