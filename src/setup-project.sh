#!/bin/bash -e

printf "Deleting all Azure AD Appregs for the project, as well as the .env files!!\n"


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
read -p "Are you sure you want to delete all Azure AD Appregs for the project? (y/n) " -n 1 -r

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    printf "Exiting script\n"
    exit 1
fi
echo
"$SCRIPTDIR"/init-env-files.sh
"$SCRIPTDIR"/create-appreg-client.sh
"$SCRIPTDIR"/create-appreg-client-secret.sh
"$SCRIPTDIR"/create-appreg-episodes-api.sh
"$SCRIPTDIR"/create-appreg-episodes-api-secret.sh
"$SCRIPTDIR"/create-appreg-quote-api.sh
"$SCRIPTDIR"/create-docker-compose-env.sh
