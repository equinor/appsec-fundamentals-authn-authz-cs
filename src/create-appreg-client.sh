#!/bin/bash -e

#
# Remember to elevate the "Application Developer" Role in Azure prior to running script
#
SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

if [ -z "$PIPELINE" ]
then
    printf "Missing PIPELINE environment variable.\nValue must match a file in the ./config folder"
    exit 1
fi

CONFIG_FILE="$SCRIPTDIR/config/$PIPELINE.cfg"
FUNCTIONS_FILE="$SCRIPTDIR/functions.sh"

if [ ! -f  "$CONFIG_FILE" ]
then
    printf "Unable to find config file %s\n" "$CONFIG_FILE"
    exit 1
fi

source "$CONFIG_FILE" 2> /dev/null
source "$FUNCTIONS_FILE" 2> /dev/null

printf "Successfully reading config file (%s)\n" "$CONFIG_FILE"


printf "Delete existing appregistration '%s' if it exists\n" "$CFG_APPREG_CLIENT_NAME"
deleteAppReg "$CFG_APPREG_CLIENT_NAME"

printf "Creating the Appregistration '%s' \n" "$CFG_APPREG_CLIENT_NAME"

CLIENT_APP_ID=$(az ad app create \
                --display-name "$CFG_APPREG_CLIENT_NAME" \
                --sign-in-audience 'AzureADMyOrg' \
                --web-redirect-uris 'http://localhost:3000/callback' \
                --output tsv \
                --query appId | tr -d '\r')

if [ ! $? -eq 0 ]
then
    printf "Failed to create the appregistration \n"
    exit 1
fi

printf "Appregistration created, new appId for client is '%s'\n" "$CLIENT_APP_ID"

printf "About to update .env file (%s%s)\n" "$CFG_ENV_FILE_DIRECTORY" "$CFG_ENV_CLIENT_FILENAME"
    
printf ":: CLIENT_ID\n"
sed -i'.bkup' 's/CLIENT_ID=.*/CLIENT_ID='\""$CLIENT_APP_ID"\"'/' "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_CLIENT_FILENAME"

printf ":: TENANT_ID\n"
sed -i'.bkup' 's/TENANT_ID=.*/TENANT_ID="'"$CFG_TENANT_ID"'"/' "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_CLIENT_FILENAME"

printf ":: Deleting value for property CLIENT_SECRET\n"
sed -i'.bkup' 's/CLIENT_SECRET=.*/CLIENT_SECRET=/' "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_CLIENT_FILENAME"

