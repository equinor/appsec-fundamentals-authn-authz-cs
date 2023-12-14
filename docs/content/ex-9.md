## Exercise 9

## "PIXI" - PKCE

Code flow for public clients using PKCE

Lower the risk related to authorization code interception/stealing.

---

## What is PKCE

* PKCE is "Proof Key for Code Exchange" for OAuth Public clients
* It is defined in [RFC 7636](https://datatracker.ietf.org/doc/draft-ietf-oauth-spop/15/) (doc at [oauth.net](https://oauth.net/2/pkce/))
* It is replacing "Implicit grant" for public clients
* It is an extension to the Authorization Code flow to prevent CSRF and authorization code injection attacks.
* PKCE can (and should be) used by confidential clients as well


---

## Elements of PKCE

<div style="font-size:0.85em">

For each request to get a token (using the auth code grant flow)

* Generate a secret known as a "Code Verifier"
* "Code Verifier" is random generated secret.<br/> (A-Z, a-z, 0-9, and the punctuation characters -._~ (hyphen, period, underscore, and tilde), between 43 and 128 characters long.)
* Generate a "Code Challenge", a SHA256 of the "Code Verifier" - url encoded
* Supply a "Code_challenge_method" to specific method of verifier - plain or s256. Use SHA256!

</div>

---

## Authorization Code Grant with PKCE (1)

(1) Client via user agent initiates

![Code Grant](content/images/oauth_code_flow.jpg)<!-- .element style="width:60%"-->

---

## Authorization Code Grant with PKCE (2)

(2) Client contacts authorization server for auth code

<table>
<col style="width:60%">
<col style="width:40%">
<tr>
  <td style=" vertical-align: top;">
  <pre><code style=" font-size: large  ">
GET /authorize?
client_id=clientid
&scope=(optional)
&reponse_type=code
&state=1234
&redirect_uri=
&code_challenge=(SHA of Code Verifier)
&code_challenge_method=S256
</code></pre>
  </td>
  <td style=" vertical-align: top;">
  <img src="content/images/oauth_code_flow.jpg" width="100%">
  </td>
</tr>
</table>

---

## Authorization Code Grant with PKCE (3)

(3) Authentication is handed over to authentication server

![Code Grant](content/images/oauth_code_flow.jpg)<!-- .element style="width:50%"-->

---

## Authorization Code Grant with PKCE (4)

(4) Authorization server is called by authentication server which redirects to defined redirect_uri upon successful authentication.

<pre><code>
303 redirect https://app/callback?code=o-t-c&state=1234
</code></pre>

![Code Grant](content/images/oauth_code_flow.jpg)<!-- .element style="width:30%"-->

---

## Authorization Code Grant with PKCE (5)

(5) Client does a post to authorization servers token end-point requesting an access token. Code verifier is included.

<table>
<col style="width:60%">
<col style="width:40%">
<tr>
  <td style=" vertical-align: top;">
  <pre><code style=" font-size: large  ">
POST /token 
&grant_type=authorization_code
&client_id=
&code_verfier=(the PKCE secret)
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

## Authorization Code Grant with PKCE (6)

(6) Upon success the client receives an access_token in response body

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

>The purpose of this exercise is to explore PKCE.

Open the file ex-09/readme.md for the exercise. ([official repo](https://github.com/equinor/appsec-fundamentals-authn-authz-cs/blob/main/ex-09/readme.md))
