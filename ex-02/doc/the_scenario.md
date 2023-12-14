# The Scenario

The purpose of this part is to explain the basic CLIENT scenario we are using in the exercise.

## Architecture  (The Back-end For Front-end (BFF) pattern)

![The Scenario](../../docs/content/images/basic_client_scenario.jpg)

## Components

This scenario has 1+1 key components. 

* The Client
  * Serving the Web front end
  * Handling /showinbox - triggering the OAuth2 code grant redirect and showing content of inbox using the O365 API
* Microsoft Entra ID
  * The Authorization Server
  * The Identity provider (Authorization Service)

