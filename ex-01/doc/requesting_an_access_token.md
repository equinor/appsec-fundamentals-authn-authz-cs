# Requesting an Access Token using using Rest Client.

Now we are continuing on the second leg of the auth code flow, using the acquired code to request a token.

Steps:

* Explore the `POST` request in 'authCode.http'
* Copy the one-time `Code` from previous exercise (leg 1) to '&code=' of the post request
* Select 'Send the request' in VSCode (just above the POST definition)
* Explore the results in the 'Response window'
  
## --Now You--

* Do the steps
* Where does the "email" in scope come from?
* Resend the POST request with the same o-t-code - observe results

## --Discuss security issues and good practices--

* This part of the communication happens in the "back-channel" <br/> (will be more obvious later on)
* Public vs. Confidential Client (Trust level)
* The importance of proper SSL, exception of localhost
* The importance of handling client_secret as a secret
  
