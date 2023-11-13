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

printf "Getting appId for %s \n" "$CFG_APPREG_EPISODES_NAME"

APPID=$(getAppId "$CFG_APPREG_EPISODES_NAME")

if [ -z "$APPID" ] && [ "$APPID" -eq 0 ]
then
    printf "Unable to find appId for %s \n, exiting" "$CFG_APPREG_EPISODES_NAME"
    exit 1
fi

printf "Creating or updating the Secret for Appregistration %s with AppId %s \n" "$CFG_APPREG_EPISODES_NAME" "$APPID"

CLIENT_SECRET=$(az ad app credential reset --id "$APPID" --display-name "$CFG_APPREG_EPISODES_SECRET_NAME" --output tsv --query password | tr -d '\r')

if [ ! $? -eq 0 ]
then
    printf "Unable to successfully create or update client secret for the appregistration\n"
    exit 1
fi

printf "Appregistration client secret created or updated\n"


printf "About to update .env file (%s%s)\n" "$CFG_ENV_FILE_DIRECTORY" "$CFG_ENV_EPISODES_FILENAME"
        
printf ":: CLIENT_SECRET\n"
sed -i'.bkup' 's/CLIENT_SECRET=.*/CLIENT_SECRET='\'"$CLIENT_SECRET"\''/' "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_EPISODES_FILENAME"