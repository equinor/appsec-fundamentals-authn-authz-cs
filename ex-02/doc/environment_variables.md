# Environment Variables

In this part we will start to investigate how we move dynamic configuration parameters out of the code and into environment variables.

Steps:

* Configure the environment variables for the application</br>!!Notice the whitespace in front of the second line? This prevents the command from entering shell command history
  ```shell
  export NODE_ENV=production
   export CLIENT_SECRET='the client secret from the AD app object'
  export CLIENT_ID="the client id from the AD app object"
  export TENANT_ID="the tenant id"
  export PORT=3000
  export REDIRECT_URI=$(aa-get-redirect-uri.sh)
  ```
* The `aa-get-redirect-uri.sh` scripts helps to extract and generate a redirect uri for your workspace</br>Examine the script at `../src/aa-get-redirect-uri.sh` (It's automatically added to the path)
* You can extract the value from the CLIENT_SECRET from the environment using the following command
  ```shell
  echo $APPSEC_AA_CLIENT_SECRET 
  ```
  alternatively this command to set value directly into CLIENT_SECRET

  ```shell
   export CLIENT_SECRET=$(echo $APPSEC_AA_CLIENT_SECRET) 
  ```
* If you have create a new code space since you configured the Entra ID Application Object for the client app, you may need to update the app registration with the proper redirect uri.


## --Now You--

* In the terminal window you have active from [preparing the environment](./preparing_the_environment.md)
  * Configure the environment variables for your app

## --Discuss security issues and good practices--

* A good practice is to move config into files, potentially **.env** files
  * The .env files should be stored outside the code repository
  * The .env files should be included in `.gitignore`
* Establish good overview over which config that needs to be treated as secrets and which does not
* NB! There are many secrets stored in a Codespace. Be vigilant of what code that you are downloading and executing