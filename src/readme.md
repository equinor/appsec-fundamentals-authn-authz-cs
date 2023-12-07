# Helper Scripts

These are various helper scripts for the A&A workshop.

The scripts use the PIPELINE environment variable to support multiple sets of configurations. This variable is usually predefined in the Codespace to **DEVELOPMENT**

## The config file

This files contains the common configuration for all scripts.

## The scripts

### `aa-get-redirect-uri.sh`

The script will return the dynamic redirect uri for the Codespace. This will be used by the .env file for the client as well as in the app registration for the client.

### `aa-save-env-files-to-github-user-secret.sh`

This script will store all .env files in **CFG_ENV_FILE_DIRECTORY** into a user specific Codespace secret named **GH_SECRET_NAME**

### `aa-create-env-files-from-github-user-secret.sh`

This script will read the local environment variable named **GH_SECRET_NAME** and extract .env files which are then stored into the **CFG_ENV_FILE_DIRECTORY** 

