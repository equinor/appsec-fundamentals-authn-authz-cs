# Script to create and configure AAD objects

Example scripts for creating AAD objects with configuration. This is not for production purposes. Secrets should be created and stored in keyvaults.

The scripts are destructive - the will delete existing object and create new ones. .env files are updated

Scripts use the PIPELINE environment variable to support a different set off appreg's, like for test, dev etc.

## Preconditions

A Linux shell (bash) with:

- [azure cli](https://learn.microsoft.com/en-us/cli/azure/?view=azure-cli-latest)
- [jq](https://jqlang.github.io/jq/)
- [sed](https://manpages.ubuntu.com/manpages/trusty/man1/sed.1.html)
- [grep](https://manpages.ubuntu.com/manpages/trusty/man1/grep.1.html)
- `uuidgen`

## The config file

Under normal course situations the only keys that should be altered would be the CFG_RESOURCE_PREFIX, CFG_ENV_FILE_DIRECTORY and CFG_TENANT_ID.

- Prefix: The prefix that will be used of AAD objects and .env files
- Environment files: Folder and names for .env files
- Tenant information: The Tenant id in Azure
- Client: Client AAD object data
- Episodes: Episodes AAD object data
- Quote: Quote AAD object data

## The scripts

### `init-env-files.sh`

The script will examine the config file and look for .env files in the proper location. If the files does not exist the script will create them from templates.

All other scripts expect's proper .env files to exist and be writable.

### `login-user.sh`

The script will search for config files and then log in the users that will execute  the scripts. In production setting this user would usually be a service principal -- if allowed by policies (policies to create AAD objects)

### `create-appreg-client.sh`

This script will read the config file and create a proper AAD appreg for the CLIENT object. If an existing appreg exists with the same name it will be deleted. The CLIENT .env files will be updated with new values.

Remember that if an existing appreg is deleted, secrets must be updated, consents must be updated etc. This immutable pattern may not be valid in all contexts.

### `create-appreg-client-secret.sh`

This script will read the config file and seek to create/reset the CLIENT_SECRET for the CLIENT object. The CLIENT .env files will be updated with new values. In production this would typically store the secrets in a Azure Key Vault.

### `create-appreg-episodes-api.sh`

This script will read the config file and create a proper AAD appreg for the EPISODES object. If an existing appreg exists with the same name it will be deleted. The EPISODES .env files will be updated with new values.

The script will also do the work to let EPISODES expose the required scope and assign permission to the CLIENT to read this scope.

Remember that if an existing appreg is deleted, secrets must be updated, consents must be updated etc. This immutable pattern may not be valid in all contexts.

### `create-appreg-episodes-api-secret.sh`

This script will read the config file and seek to create/reset the CLIENT_SECRET for the EPISODES object. The EPISODES .env files will be updated with new values. In production this would typically store the secrets in a Azure Key Vault.

### `create-appreg-quote-api.sh`

This script will read the config file and create a proper AAD appreg for the QUOTE object. If an existing appreg exists with the same name it will be deleted. The QUOTE .env files will be updated with new values.

The script will also do the work to let QUOTE expose the required scope and assign permission to the EPISODES to read this scope.

Remember that if an existing appreg is deleted, secrets must be updated, consents must be updated etc. This immutable pattern may not be valid in all contexts.

### `create-docker-compose-env.sh`

This script will read the config file and then populate the .env file used by Docker compose. This script assumes that .evn files for the client, the episodes and quote api's exists and container the proper data.

### `tear-down-project.sh`

This script will read the config file and delete all created AAD AppRegs as well as the .env files

### `setup-project.sh`

This script will read the config file, copy .env files from template and then run the necessary scripts to create the AAD objects and update the .env files.

## Manual execution

Make sure the config file is up-to-date for the PIPELINE in questions
Make sure directory for .env files exists

Assuming `./src` is current directory

```bash
export PIPELINE=development
./init-env-files.sh
./login-user.sh
./create-appreg-client.sh
./create-appreg-client-secret.sh
./create-appreg-episodes-api.sh
./create-appreg-episodes-api-secret.sh
./create-appreg-quote-api.sh
```

## Automatic execution

- Make sure the config file is up-to-date for the PIPELINE in questions
- Make sure directory for .env files exists
- Make sure you have authenticated with the azure cli (use `./login-user.sh`)

Assuming `./src` is current directory

```bash
export PIPELINE=development
./tear-down-project.sh
./setup-project.sh
```

## Potential extensions

## Creating test user

Using a MS Office Developer Tenant it's quite easy to create/delete test users for running automated tests. A basic scenario could look like this:

Pre-Test
```bash
az ad user create --display-name "Test McTester" --password "a-super-secret-that-will-be-deleted-with-user-after-test-run" --user-principal-name "mctester@<your dev tenant>.onmicrosoft.com"
```

Post-Test
```bash
az ad user delete --id "id of test user"
```

Issues:
- The scripts building test users should most likely
  - also build groups and connect these to users - and similar stuff
  - perform an admin concent on scopes and permissions (assuming no interactive user login prior running tests)

**We recommend doing a threat model of your development- and test-environments! This would include the CI pipelines**
