# Requesting an Access Token

Now we are continuing on the second leg of the auth code flow, using the acquired code to request a token.

## Registering the client secret

The client need to authenticate itself with the Authorization Server (Microsoft Entra ID). For this it uses a client secret.

Steps:

* Register a client secret for your application (In 'Certificates and Secrets')
  * Expire: 7 days
  * Copy the secret *value* (not the secret id)
* Execute the following command to make the client secret available to the environment (add your secret value)

    ```shell
    export CLIENT_SECRET='THE-VALUE-OF-YOUR-CLIENT-SECRET'
    ```
 
## --Now You--

* Do the steps


## Getting the access token

Steps:

* We assume your terminal window is in `./ex-01`
* Open and explore `./ex-01/second-leg.py` file in VSCode.
* Update values for the following variables:
  * Your tenant id (`tenant_id`)
  * Your client id (`client_id`)
  * The redirect URI (`redirect_uri`)
  * The One time code (`authorization_code`) (use code from first leg)
  * (The client_secret is read from the terminal environment)
* Execute `second-leg.py`

```shell
python ./second-leg.py
````

## --Now You--

* Do the steps
* Resend the POST request with the same o-t-code - observe results

## --Discuss security issues and good practices--

* This part of the communication happens in the "back-channel" (will be more obvious later on)
* Public vs. Confidential Client (Trust level)
* The importance of proper SSL, exception of localhost
* The importance of handling `client_secret` as a secret
