## Exercise 8

## The Implicit grant

SPA, Native, Mobile

---

## OAuth2 Implicit Grant ([rfc6749 4.2](https://datatracker.ietf.org/doc/html/rfc6749#section-4.2))

![Implicit Grant](content/images/oauth2_implicit.jpg)<!-- .element style="width:50%"-->

---

## Implicit Grant (2)

(2) Client contacts authorization server for token on authorize end-point

<table>
<col style="width:60%">
<col style="width:40%">
<tr>
  <td style=" vertical-align: top;">
  <pre><code style=" font-size: large  ">
GET /authorize?
client_id=client
&scope=
&response_type=token
&state=1234
&redirect_uri=
</code></pre>
  </td>
  <td style=" vertical-align: top;">
  <img src="content/images/oauth_implicit_flow.jpg" width="100%">
  </td>
</tr>
</table>

---

## Implicit Grant (3)

(3) Authentication is handed over to authentication server

![Code Grant](content/images/oauth_implicit_flow.jpg)<!-- .element style="width:50%"-->

---

## Implicit Grant (4)

(4) Client receives access token in fragment

<table>
<col style="width:60%">
<col style="width:40%">
<tr>
  <td style=" vertical-align: top;">
  <pre><code style=" font-size: large  ">
303 redirect https://app/callback#
access_token=(string)
&expires_in=3600
&token_type=Bearer
&state=1234
</code></pre>
  </td>
  <td style=" vertical-align: top;">
  <img src="content/images/oauth_implicit_flow.jpg" width="100%">
  </td>
</tr>
</table>


---

## OIDC Implicit flow (2)

(for comparison - [spec](https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth))

(2) Client contacts authorization server for token on authorize end-point<!-- .element style="font-size:0.7em"-->

<table>
<col style="width:60%">
<col style="width:40%">
<tr>
  <td style=" vertical-align: top;">
  <pre><code style=" font-size: large ">
GET /authorize?
client_id=client
&scope=openid
&response_type=id_token
&state=1234
&nonce=
&redirect_uri=
</code></pre>
  </td>
  <td style=" vertical-align: top;">
  <img src="content/images/oauth_implicit_flow.jpg" width="100%">
  </td>
</tr>
</table>

(scope, response_type and nonce is the difference)<!-- .element style="font-size:0.7em"-->

---

## OIDC Implicit flow (4)

(4) Client receives id token i response fragment<!-- .element style="font-size:0.7em"-->

<table>
<col style="width:60%">
<col style="width:40%">
<tr>
  <td style=" vertical-align: top;">
  <pre><code style=" font-size: large  ">
303 redirect https://app/callback#
id_token=(string)
&expires_in=3600
&token_type=Bearer
&state=1234
&nonce=a_nonce
</code></pre>
  </td>
  <td style=" vertical-align: top;">
  <img src="content/images/oauth_implicit_flow.jpg" width="100%">
  </td>
</tr>
</table>

---

Open the file ex-08/readme.md for the exercise. ([official repo](https://github.com/equinor/appsec-fundamentals-authn-authz/blob/main/ex-08/readme.md))
