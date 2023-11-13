#!/bin/bash -e

printf "Creating all Azure AD Appregs for the project, as well as the .env files and all .bkup files!!!\n"


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

#Aske the user if he/she is sure
read -p "Are you sure you want to create all Azure AD Appregs and .env for the project? (y/n) " -n 1 -r

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    printf "Exiting script\n"
    exit 1
fi

printf "\n\nDelete existing appregistration %s if it exists\n" "$CFG_APPREG_CLIENT_NAME"
deleteAppReg "$CFG_APPREG_CLIENT_NAME"

printf "Delete existing appregistration %s if it exists\n" "$CFG_APPREG_EPISODES_NAME"
deleteAppReg "$CFG_APPREG_EPISODES_NAME"

printf "Delete existing appregistration %s if it exists\n" "$CFG_APPREG_QUOTE_NAME"
deleteAppReg "$CFG_APPREG_QUOTE_NAME"

printf "Delete .env files with prefix %s\n" "$CFG_RESOURCE_PREFIX"
rm -f "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_CLIENT_FILENAME"
rm -f "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_EPISODES_FILENAME"
rm -f "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_QUOTE_FILENAME"
rm -f "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_DOCKER_COMPOSE_FILENAME"

printf "Delete .bkup files in %s\n" "$CFG_ENV_FILE_DIRECTORY"
rm -f "$CFG_ENV_FILE_DIRECTORY"/*.bkup


