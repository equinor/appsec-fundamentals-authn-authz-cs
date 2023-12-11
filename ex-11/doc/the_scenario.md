# The OBO Scenario

The purpose of this part is to explain the API scenario we are using in the exercise.

## Architecture

![The Scenario](../../docs/content/images/o-b-o-scenario.jpg)

## Components

This scenario has 3+1 key components. The 3 key components are independent of each-other and can be seen as microservices.

* The Client
  * Serving the Web front end
  * Handling login/logout, sessions, token cache
  * Managing requests for authentication and authorization (Graph Api, Episodes API)
  * Requesting users InBox from the O365 API
  * Requesting a list of GOT Episodes from the Episodes API
* The Episodes API
  * The protected resource server for Episodes
  * Serve a JSON document with GOT Episodes at /api/episodes
  * Requests needs to be validated, tokens needs to be issued by Microsoft Entra ID
  * Using O-B-O to request an access token from Microsoft Entra ID to be used towards the GOT Quotes API
  * Read quotes and include them in episode response to clients
* The Quotes API
  * The protected resource for GOT Quotes
  * Receives and authorize requests (JWT tokens issues by Microsoft Entra ID)
  * Sends a random GOT Quote back to the Episodes API
* Microsoft Entra ID
  * The identity provider and the Authority Server

Steps:

## The flow

The general use case flow is as follow:

1. The Client does a login and get an Id token and an access token for the O365 graph
2. The Client requests and access token to be used when requesting Episodes
3. The Client uses the access token and request a list of GOT Episodes. Scope is Episodes.Read
4. The Episodes API validates the request and the access token
5. The Episodes API uses the received access token and try to exchange this for a new access token for accessing the Quotes API. This is done on behalf of the user - hence the O-B-O flow (even if we are operating at application permissions in our example)
6. The Episodes API gets a separate access token that will be used when requesting a GOT quote
7. The Episodes API requests a GOT Quote from the Quote API. Scope Quote.Read
8. The Quotes API receives and validates the request. If the requests validates and the JWT token is valid, then a random quote is returned
9. The Episodes API receives a quote
10. The Client Receives a list of Got Episodes with a quote at the end.