# Exploring tokens

With a bit of luck we should now have received a set of tokens. In this part we will do the exploration of the different tokens.

Steps:

* These steps assumes you have the POST request with tokens from the second leg available
* Open [https://jwt.ms](https://jwt.ms) (This is a Microsoft Tool to explore tokens).
* Copy in the Access Token and explore
  * Format (header, payload, signature)
  * Decoded
  * Claims (aud, iss, nbf, exp, appid, scp)
* Remember the _token config_ in the AD App Object? This can be used to include additional claims
  * Standard claims in a JWT token - [RFC 7519](https://tools.ietf.org/html/rfc7519#section-4)
  * Registry for public claims to avoid naming conflicts - [IANA](https://www.iana.org/assignments/jwt/jwt.xhtml)
  * Standard OIDC JWT Token Claims - [1.0](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)


## --Now You--

* The "email" scope will put/remove info from the _id_token_
* Experiment with scope, add _offline_access_ to the scope and explore the "refresh_token"

## --Discuss security issues and good practices--

* Tokens should be handled as secrets - they are confidential information
* Be cautious on which tools you use to examine tokens - especially online ones!
* Token validation is important - for the intended recipient of the token
* Token storage/caching is always a tricky question
* A good practice is to "not use access tokens as proof of authentication". Access tokens are for the protected resource. It's just like a bus ticket - it grant you access to the buss but do not prove that you are you - even if the ticket has your name on it.

