<!-- markdownlint-disable MD033 MD028-->
# The Basics of A&A

(part 1)

---

## Authentication vs Authorization

>Authentication is the mechanism to <br/>verify the identity of a user

>Authorization is the mechanism to <br/>verify access to a resource

---

## OAuth2

* OAuth2 is defined in [rfc6749](https://datatracker.ietf.org/doc/html/rfc6749) <br/>- "The OAuth 2.0 Authorization Framework"
* The OAuth 2.0 authorization framework enables a third-party application to obtain limited access to an HTTP service, 
  * either on behalf of a resource owner -- by orchestrating an approval interaction between the resource owner and the HTTP service 
  * or by allowing the third-party application to obtain access on it's own part.
* OAuth2 is a "delegation protocol", a means of giving someone who controls a resource the capability to delegate access to the resource on their behalf.

---

## OAuth2 vs OpenID Connect (OIDC)

* OAuth is for delegation, the goal is to access api's
  * To get a ticket (token) which gives access to a protected resource
* OpenID Connect is an identify layer on top of OAuth
  * Answering key question: Who is logged in?
  * Defines user authentication metadata
  * Can control authentication
  * Supports federation

---

## OAuth2 Roles/Actors

<div style="font-size:0.8em">

* resource owner
  * An entity capable of granting access to a protected resource. When the resource owner is a person, it is referred to as an end-user.
* resource server
  * The server hosting the protected resources, capable of accepting and responding to protected resource requests using access tokens.
* client
  * An application making protected resource requests on behalf of the resource owner and with its authorization. The term "client" does not imply any particular implementation characteristics (e.g., whether the application executes on a server, a desktop, or other devices). 
* authorization server
  * The server issuing access tokens to the client after successfully authenticating the resource owner and obtaining authorization.
  * The trusted 3rd party.

</div>

---

## Actors

![Actors](content/images/actors.jpg)<!-- .element style="width:50%"-->

---

## Actors - simple api

![Actors for Simple Api](content/images/basic_eq_api.jpg)<!-- .element style="width:50%"-->

---

## Actors - web app

![Actors for Web App](content/images/basic_eq_web_app.jpg)<!-- .element style="width:50%"-->

Many scenarios will require __your__ app/api's to play multiples roles, often involving a request chain.

---


## Abstract protocol flow

[RFC6749 1.2](https://datatracker.ietf.org/doc/html/rfc6749#section-1.2)

![Abstract flow](content/images/rfc6749_abstract_flow.png)<!-- .element style="width:40%"-->

<div style="font-size:0.7em">

* (A) The client requests authorization from the resource owner. The authorization request can be made directly to the resource owner (as shown), or preferably indirectly via the authorization server as an intermediary.<!-- .element style="font-size: 0.60em"-->
* (B) The client receives an authorization grant, which is a credential representing the resource owner's authorization, expressed using one of four grant types defined in this specification or using an extension grant type. The authorization grant type depends on the method used by the client to request authorization and the types supported by the authorization server. <!-- .element style="font-size: 0.60em"-->
* (C): The client requests an access token by authenticating with the authorization server and presenting the authorization grant. <!-- .element style="font-size: 0.60em"-->
* (D) The authorization server authenticates the client and validates the authorization grant, and if valid, issues an access token. <!-- .element style="font-size: 0.60em"-->
* (E) The client requests the protected resource from the resource server and authenticates by presenting the access token. <!-- .element style="font-size: 0.60em"-->
* (F) The resource server validates the access token, and if valid, serves the request. <!-- .element style="font-size: 0.60em"-->

</div>

---

## What OAuth2 is and is-not

* Is not defined outside HTTP
* Is "requiring" TLS
* Is not an authentication protocol
* Is not processing authorization
* Is not defining user-to-user delegation
* Is not defining a token format
* Is not defining crypto methods
* Is not a single protocol - it supports multiple use cases - it's a protocol for protocols

---

## Obtaining the authorization <br/>- the OAuth dance

<div style="font-size:0.7em">

* To request an access token, the client obtains authorization from the resource owner. 
* The authorization is expressed in the form of an authorization grant, which the client uses to request the access token. 
* OAuth2 defines four grant types:
  * [authorization code](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1)
  * [implicit](https://datatracker.ietf.org/doc/html/rfc6749#section-4.2)
  * [resource owner password credentials](https://datatracker.ietf.org/doc/html/rfc6749#section-4.3)
  * [client credentials](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4)
* It also provides an extension mechanism for defining additional grant types.

> It's all about getting tokens, access tokens (to provide access), id tokens (to prove identity) and refresh tokens

</div>

---

## The Authorization Code Grant<br/>[rfc6749 - 4.1](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1)

| | |
| - | - |
| ![Code Grant](content/images/rfc6749_code_grant.png)<!-- .element style="width:78%"--> | ![Code Grant](content/images/actors.jpg)<!-- .element style="width:70%"--> |

---

## Authorization Code Grant (1)

(1) Client via user agent initiates

![Code Grant](content/images/oauth_code_flow.jpg)<!-- .element style="width:60%"-->

---

## Authorization Code Grant (2)

(2) Client contacts authorization server for code on authorize end-point

<table>
<col style="width:60%">
<col style="width:40%">
<tr>
  <td style=" vertical-align: top;">
  <pre><code style=" font-size: large  ">
GET /authorize?
client_id=clientid
&scope=(optional)
&response_type=code
&state=1234
&redirect_uri=https://app/callback
(&response_mode=form_post/query)
  </code></pre>
  </td>
  <td style=" vertical-align: top;">
  <img src="content/images/oauth_code_flow.jpg" width="100%">
  </td>
</tr>
</table>

(Response_mode is not part of the oAuth2 specification, </br>but it's recommended by Microsoft for oAuth2 Code grant. response_mode is OICD)<!-- .element style="font-size:0.5em; align="left"--> ([link](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow#request-an-authorization-code))
---

## Authorization Code Grant (3)

(3) Authentication is handed over to authentication server

![Code Grant](content/images/oauth_code_flow.jpg)<!-- .element style="width:30%"-->

---

## Authorization Code Grant (4)

(4) Authorization server is called by authentication server which redirects to defined redirect_uri upon successful authentication.

<pre><code>
303 redirect https://app/callback?code=o-t-c&state=1234
</code></pre>

![Code Grant](content/images/oauth_code_flow.jpg)<!-- .element style="width:30%"-->

---

## Authorization Code Grant (5)

(5) Client does a post to the authorization server's token end-point requesting an access token.

<table>
<col style="width:60%">
<col style="width:40%">
<tr>
  <td style=" vertical-align: top;">
  <pre><code style=" font-size: large">
POST /token 
grant_type=authorization_code
&client_id=
&client_secret=
&code=
&redirect_uri=
  </code></pre>
  </td>
  <td style=" vertical-align: top;">
  <img src="content/images/oauth_code_flow.jpg" width="100%">
  </td>
</tr>
</table>

---

## Authorization Code Grant (6)

(6) Upon success the client receives an access_token in the response body

<table>
<col style="width:60%">
<col style="width:40%">
<tr>
  <td style=" vertical-align: top;">
  <pre><code style=" font-size: large  ">
{
"access_token":"2YotnFZFEjr1zCsicMWpAA",
"token_type":"Bearer",
"expires_in":3600
}
</code></pre>
  </td>
  <td style=" vertical-align: top;">
  <img src="content/images/oauth_code_flow.jpg" width="100%">
  </td>
</tr>
</table>

---

## OpenID Connect ([OIDC](https://openid.net/connect/))

* Identity layer built on-top of OAuth2
* Answer to the "Who is logged in" question
* Defines user authentication meta data
* Can control authentication
* Enables federation of identities

<p/>

| --OAuth2 term-- | --OIDC term-- |
| -- | -- |
| Resource Owner | User |
| Client | Relying Party |
| Authorization Server, Protected Resource | Identity Provider |

---

## OpenID Connect Code Flow (1)

(1) Client via user agent initiates

![Code Grant](content/images/oauth_code_flow.jpg)<!-- .element style="width:60%"-->

---

### OpenID Connect Code Flow (2)

(2) Client contacts authorization server for code on authorize end-point. Scope=openid triggers OIDC <!-- .element style="font-size: 0.5em"-->

<table>
<col style="width:60%">
<col style="width:40%">
<tr>
  <td style=" vertical-align: top;">
  <pre style="font-size: 0.55em"><code>
GET /authorize?
client_id=clientid
&scope=profile+openid
&response_type=code
&state=1234
&redirect_uri=https://app/callback
(&response_mode=form_post/query)
</code></pre>
  </td>
  <td style=" vertical-align: top;">
  <img src="content/images/oauth_code_flow.jpg" width="100%">
  </td>
</tr>
</table>

(FYI: When reading up on the details of the OICD spec and MS's implementation </br> you will see that there are some differences in which params that are optional, required etc. </br>There also different flows for just getting the ID token vs. getting the ID token and an access token)<!-- .element style="font-size:0.5em; align="left"--> 

---

## OpenID Connect Code Flow (3)

(3) Authentication is handed over to authentication server

![Code Grant](content/images/oauth_code_flow.jpg)<!-- .element style="width:30%"-->

---

## OpenID Connect Code Flow (4)

(4) Authorization server is called by authentication server which redirects to defined redirect_uri upon successful authentication.

<pre><code>
303 redirect https://app/callback?code=o-t-c&state=1234
</code></pre>

![Code Grant](content/images/oauth_code_flow.jpg)<!-- .element style="width:30%"-->

---

## OpenID Connect Code Flow (5)

(5) Client does a post to authorization servers token end-point requesting an access token.

<table>
<col style="width:60%">
<col style="width:40%">
<tr>
  <td style=" vertical-align: top;">
  <pre style="font-size: 0.55em"><code>
POST /token 
grant_type=authorization_code
&client_id=
&client_secret=
&code=
&redirect_uri=
</code></pre>
  </td>
  <td style=" vertical-align: top;">
  <img src="content/images/oauth_code_flow.jpg" width="100%">
  </td>
</tr>
</table>

---

## OpenID Connect Code Flow (6)

(6) Upon success the client receives an access_token and an --id token-- in the response body

<table>
<col style="width:60%">
<col style="width:40%">
<tr>
  <td style=" vertical-align: top;">
  <pre><code style=" font-size: large  ">
{
"access_token":"2YotnFZFEjr1zCsicMWpAA",
"id_token": "eynndj3nn77hs7Hhjhjh",
"token_type":"Bearer",
"expires_in":3600
}
</code></pre>
  </td>
  <td style=" vertical-align: top;">
  <img src="content/images/oauth_code_flow.jpg" width="100%">
  </td>
</tr>
</table>

---

## OpenID Connect (OIDC)

<div style="font-size:0.8em">

* New IDToken received upon successful authentication and serves as proof of who's authenticated
* Access tokens are not proof of authentication. They are not intended for client - rather the protected resource
* IDToken's can be given to client along with Access tokens
* IDTokens' are signed JWT tokens.
* ID tokens contains claims such as
  * iss - issuer of the token
  * sub - subject - user id from identity provider
  * aud - audience - id for relying party
  * exp - expiration time stamp
* For the Azure implementation, more [documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc) on the Microsoft Identity Platform doc pages. Explore attributes such as "prompt", "login_hint", "response_mode".

</div>

---

## Please Note

* Use Microsoft Entra ID v2 - MSAL
* Microsoft Entra ID v1 (ADAL) was [deprecated](https://github.com/azure-deprecation/dashboard/issues/60) on December 31th 2022.
* (Be aware of doc/answers and v1 vs. v2 (it's easy to read the wrong docs or old answers on stack overflow 😀 ))

