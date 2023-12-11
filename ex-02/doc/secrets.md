# Config and Secrets

Let's spend a bit more time on discussing app configuration and secrets -- and how to handle them.

Steps:

* Move your config into a `.env` file outside the source folder
  * We will create a new folder in your codespace to keep config including secrets. This folder will not be part of the source code. It has the same life cycle as the codespace
    ```shell
    mkdir $HOME/envs
    ```
  * Create a file to hold the config (appsec-course-client-eq.env)
    ```shell
    code $HOME/envs/appsec-course-client-eq.env
    ```
  * Add all the necessary export statements and save the file (`history |grep -i export`) may be handy)
* Using a new **fresh** terminal window, source the file and run the application

  ```shell
  cd ex-02
  source ~/envs/appsec-course-client-eq.env
  npm start
  ```
* Once the needed config is saved into the .env file we can delete the Codespace user secret for Client Secret.

  ```shell
  aa-delete-client-secret.sh 
  ```


## --Now You--

* Do the steps
* When done - offer your help to other participants


## Persisting Config

We have stored out config in `.env` files. The config includes secrets. The life cycle of the .env files follow the codespace. When a codespace is deleted the .env files, and our config are gone. To facilitate this workshop we have implemented a pattern where we persist the .env files inside a Github Codespaces User Secret. This User Secret is made available as an environment variables for the repos's you have given access to. Users secrets are only accessible to a specific user, defined as part of their profile/settings. The size limit for Github secrets is 48Kb.

Steps:

* Open your profile on Github and locate settings and Codespaces ([https://github.com/settings/codespaces](https://github.com/settings/codespaces))
* Locate the section for "Codespaces Secrets"
* In your codespace locate and examine the script that persist the config
  * `./src/aa-save-env-files-to-github-user-secret.sh`
  * It reads all the config files (.env), stores them in an internal variable (filname:content),base64 encode the content, saves it to the Codespaces User Secret (defined in the `./src/config/development.cfg`) and then gives the current repo access to this secret.
* In your codespace locate and examine the script that create .env files from the secret
  * `./src/aa-create-env-files-from-github-user-secret.sh`
  * It extracts information from the environment variable containing the secret, base64 decodes, extracts filename and content and save this in the config folder.
* Persist the config
  ```shell
  aa-save-env-files-to-github-user-secret.sh
  ```
* Codespaces will sense that a dependency has been updated (the secret) and as if you will reload, select "Reload to apply"
* To generate config files do
  ```shell
  aa-create-env-files-from-github-user-secret.sh
  ```
* Remember this cycle whenever you want to persist your config through the course

## --Now You--

* Do the steps


## --Discuss security issues and good practices--

* Good practice - Keep secrets out of version control
* Good practice - Inject secrets to apps using environment variables (assumes that you trust the client!)
* Good practice - Use keyvault to store secrets
  * The **identity** that is used to read the vault should have the least possible privilege level
* Good Practice - Use Managed Service Identities (MSI) to read secrets from keyvault
  * Observe: This is NOT a 100% secure solution. It still requires high confidence/trust into client environment
* Good Practice - Rotate secrets often - preferably automated
* Good Practice - MS Recommend using Certificates (non self signed for production) rather than client secret "strings"
  * Anyone have experience with this pattern? What's the root CA that's used?
* Storing secrets as part of ordinary config may make sense in some scenarios (like we have done 👆)
* Good Practice - Scan for Secrets in your dev environment. The AppSec Team has workshops on this as well, the [AppSec Fundamentals Secret Scanning](https://github.com/equinor/appsec-fundamentals-secret-scanning) workshop.⚡️
