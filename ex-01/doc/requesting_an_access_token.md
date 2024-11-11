# Requesting an Access Token

Now we are continuing on the second leg of the auth code flow, using the acquired code to request a token.


## Registering the client secret

The client need to authenticate itself with the Authorization Server (MS Entra ID). For this it uses a client secret.

Steps:

* Register a client secret for your application (In 'Certificates and Secrets')
  * Expire: 7 days
  * Copy the secret *value* (not the secret id)
* Execute the following command to make the client secret available to the environment (change <the secret> with the value)

    ```shell
    export CLIENT_SECRET='<the secret>'
    ```
 
## --Now You--

* Do the steps


## Getting the access token

Steps:

* Explore the `POST` request in 'authCode.http'
* Copy the one-time `Code` from previous exercise (leg 1) to `&code=` of the post request
* Select "Send the request" in VSCode (just above the POST definition)
* Explore the results in the 'Response window'
  
## --Now You--

* Do the steps
* Resend the POST request with the same o-t-code - observe results

## --Discuss security issues and good practices--

* This part of the communication happens in the "back-channel"  
(will be more obvious later on)
* Public vs. Confidential Client (Trust level)
* The importance of proper SSL, exception of localhost
* The importance of handling `client_secret` as a secret
