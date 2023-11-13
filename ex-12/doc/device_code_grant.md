# Device Code Grant

The Device Code Grant is defined by [RFC 8628 - OAuth 2.0 Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628)

Abstract

>The OAuth 2.0 device authorization grant is designed for Internet-
connected devices that either lack a browser to perform a user-agent-
based authorization or are input constrained to the extent that
requiring the user to input text in order to authenticate during the
authorization flow is impractical.  It enables OAuth clients on such
devices (like smart TVs, media consoles, digital picture frames, and
printers) to obtain user authorization to access protected resources
by using a user agent on a separate device.

As developers we often meet this flow in CLI's (Command Line Interfaces)


Steps:

* Investigate [RFC 8628 - OAuth 2.0 Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628)
  * The intro - flow
  * The Device Authorization Request
  * The Device Authorization Response
  * User interaction, visit url and enter code
  * Polling for access token
    * Device Access Token Request
    * Device Access Token Response
  * Security Considerations
* Investigate the [Microsoft identity platform and the OAuth 2.0 device authorization grant flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-device-code)
  * The Protocol Diagram
  * Device authorization request
  * Device authorization response
  * Authenticating the user
  * Successful authentication response

In our example code we will use MSAL for implementing this grant.

## --Now You--

* Use the steps above and make yourself familiar with the RFC and the MS implementation
  