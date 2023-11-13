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

printf "Delete existing appregistration %s if it exists\n" "$CFG_APPREG_QUOTE_NAME"
deleteAppReg "$CFG_APPREG_QUOTE_NAME"

printf "Creating the Appregistration %s \n" "$CFG_APPREG_QUOTE_NAME"

QUOTE_APP_ID=$(az ad app create \
                --display-name "$CFG_APPREG_QUOTE_NAME" \
                --sign-in-audience 'AzureADMyOrg' \
                --output tsv \
                --query appId | tr -d '\r')

if [ ! $? -eq 0 ]
then
    printf "Unable to successfully create the appregistration \n"
    exit 1
fi

printf "Appregistration created, new appId for Quote is %s\n" "$QUOTE_APP_ID"

printf "Registering oAuth2 Scopes \n"

GENERATED_SCOPE_ID=$(uuid4gen)

API_SCOPE=$(echo "$CFG_APPREG_QUOTE_API_SCOPE" | sed 's/UUIDGENERATED/'"$GENERATED_SCOPE_ID"'/' | jqparse .)

az ad app update \
        --id "$QUOTE_APP_ID" \
        --identifier-uris "api://""$QUOTE_APP_ID" \
        --set api="$API_SCOPE"


printf "Assigning the EPISODES Client permission to the Quote Scope \n"

EPISODES_APP_ID=$(getAppId "$CFG_APPREG_EPISODES_NAME")
API_PERMISSIONS=$(echo "$CFG_APPREG_QUOTE_API_PERMISSIONS" | sed 's/EPISODES_CLIENTID/'"$EPISODES_APP_ID"'/g; s/SCOPE_PERMISSION_ID/'"$GENERATED_SCOPE_ID"'/g' | jqparse .)

az ad app update \
    --id "$QUOTE_APP_ID" \
    --set api="$API_PERMISSIONS"


printf "Getting the API's identifierUri \n"
QUOTE_API_URI=$(getIdentifierUri "$QUOTE_APP_ID")

#Updating .env files with the new config

printf "About to update .env file (%s%s)\n" "$CFG_ENV_FILE_DIRECTORY" "$CFG_ENV_QUOTE_FILENAME"

printf ":: TENANT_ID\n"
sed -i'.bkup' 's/TENANT_ID=.*/TENANT_ID="'"$CFG_TENANT_ID"'"/' "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_QUOTE_FILENAME"

printf ":: QUOTE_API_URI=\n"
sed -i'.bkup' 's/QUOTES_API_URI=.*/QUOTES_API_URI="'"$QUOTE_API_URI"'"/' "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_QUOTE_FILENAME"

printf "About to update .env file %s%s)\n" "($CFG_ENV_FILE_DIRECTORY" "$CFG_ENV_EPISODES_FILENAME"
printf ":: QUOTES_API_URI=\n"
sed -i'.bkup' 's/QUOTES_API_URI=.*/QUOTES_API_URI="'"$QUOTE_API_URI"'"/' "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_EPISODES_FILENAME"
