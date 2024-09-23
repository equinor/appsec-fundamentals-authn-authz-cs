<!-- markdownlint-disable MD033 MD028-->

# The Basics of A&A

(part 2)

---

## Clients

<div style="font-size:0.8em">

* Clients are either confidential or public 
  * Confidential: Clients capable of maintaining the confidentiality of their credentials. (Web apps)
  * Public: Clients incapable of maintaining the confidentiality of their credentials (SPA, Native, Mobile) 
* Clients provide a redirection URI

</div>

![Actors](content/images/actors.jpg)<!-- .element style="width:40%"-->

---

## Protocol end-points

<div style="font-size:0.7em">

* /authorization
  * used by client to get authorization from resource owner,</br>user is involved - delegation 
* /token
  * used by client to exchange authorization grant for an access token 
* Authorization Servers and identity providers usually has a few more endpoint like
  * /revoke
* OIDC has a discovery end-point
  * /.well-known/openid-configuration
  * (Frameworks and IDP's usually has other discovery end-points as well)

</div>

![Actors](content/images/actors.jpg)<!-- .element style="width:30%"-->

---

## Channels – interaction between actors

<div style="font-size:0.7em">

* Front-channel
  * Communication between two parties through an intermediate </br>(the web browser, solid line)
* Back-channel
  * Communication happening outside the view of the resource owner and the user agent (dashed lines)

</div>

![Actors](content/images/oauth_code_flow.jpg)<!-- .element style="width:50%"-->

---

## Tokens

* Token type: How it can be used
  * Use it as is, bearer type (Access token) <br/> ([rfc6750](https://datatracker.ietf.org/doc/html/rfc6750)) - The OAuth 2.0 Authorization Framework: Bearer Token Usage
  * Use it, but prove that I own it (Proof Of Possession)(No wide implementation yet?)
* Token format: Encoding
  * By value (token contains all values)
  * By reference (pointer to more information)
* Token purpose: Who is it for?
  * This is very important! (Client, Authorization Server, Resource Server)

---

## Access token

* Access tokens are credentials used to access protected resources. 
* An access token is a string representing an authorization issued to the client. 
* The string is usually opaque to the client.
* Tokens represent specific scopes and durations of access, granted by the resource owner (or admin), and enforced by the resource server and authorization server. 
* By reference or value, for resource server, bearer type

---

## Refresh token

<div style="font-size:0.8em">

* Refresh tokens are credentials used to obtain access tokens.
* Refresh tokens are issued to the client by the authorization server and are used to 
  * obtain a new access token when the current access token becomes invalid or expires,
  * or to dynamically obtain additional access tokens with identical or narrower scope (access tokens may have a shorter lifetime and fewer permissions than authorized by the resource owner).
* Issuing a refresh token is optional at the discretion of the authorization server. If the authorization server issues a refresh token, it is included when issuing an access token. 
* By value, for client/authorization server

</div>

---

## ID Token

* ID tokens are issued to the client to validate that a user is who he/she claims to be
* ID tokens can provide additional information about the user that can be used to drive the OAuth2 client.
* ID tokens are issued as part of OpenID connect
* By value, for client

---

## Microsoft Entra ID 

Microsoft Entra ID (AAD) issues JWT tokens (access, id). It's up to the discretion of the authorization server to decide what tokens to issue and the format they have.

* JSON Web Token (JWT)([rfc7519)](https://datatracker.ietf.org/doc/html/rfc7519) 
* Format is header.body.signature (using base64 encoding)
* Example:  


<table>
<col style="width:60%">
<col style="width:40%">
<tr>
  <td style=" vertical-align: top;">
<pre><code>eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJIUzI1NiJ9.
eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA.
dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
</code></pre>
  </td>
  <td style=" vertical-align: top;">
  <img src="content/images/jwt_decoded.png" width="60%">
  </td>
</tr>
</table>

---

## Example ID Token

* Microsoft Entra ID Id Token [Claims](https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens)

![Id Token Decoded](content/images/id_token_decoded.png)<!-- .element style="width:50%"-->

---

## Scope

* Defined the scope of access
* Defines permissions given in the access token
* Consent (user, admin)
* The scope request is configured on the client
* The scope is requested in the flow
* The Authorization Server determines if scope should be issued

---

## Consent

* Scope can be consented by 
  * User, on on-behalf of self
  * Admin, on behalf of organization
* The consent is about delegating the client access on the resource server on a users behalf
* User-Consent in Equinor is quite limited! ⚡️
  * More information in [Omnia Docs](https://docs.omnia.equinor.com/governance/iam/App-General-Info/) ⚡️
  * We will visit this later in the workshop

---

## Token Introspection

* The process for a protected resource to query the authorization server to verify validity of a OAuth2 token
* An extension to OAuth2 defined in [rfc7662](https://datatracker.ietf.org/doc/html/rfc7662)
* Getting tokens type by ref and querying for "details"
* Not currently supported by Microsoft Entra ID<br/> ([7+ year old request](https://feedback.azure.com/d365community/idea/ea407180-be25-ec11-b6e6-000d3a4f0789))
* No introspection limits the value of the /revoke end-point?
