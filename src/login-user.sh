#!/bin/bash -e

SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

if [ -z "$PIPELINE" ]
then
    printf "Missing PIPELINE environment variable.\nValue must match a file in the ./config folder\n"
    exit 1
fi

CONFIG_FILE="$SCRIPTDIR/config/$PIPELINE.cfg"

if [ ! -f  "$CONFIG_FILE" ]
then
    printf "Unable to find config file %s\n" "$CONFIG_FILE"
    exit 1
fi

source "$CONFIG_FILE" 2> /dev/null

printf "Successfully read config file (%s)\n" "$CONFIG_FILE"

# ACTIVEUSER=`az account show --query user.name`
# printf "Current active user / service principal: $ACTIVEUSER \n"
printf "Logging in new user\n"
az login --tenant "$CFG_TENANT_ID" --allow-no-subscription -o none

if [ $? != 0 ]
then
    # Exit the script if the above command failed
    printf "Error: az login failed.\n" 1>&2
    exit 1
fi

ACTIVEUSER=$(az account show --query user.name | tr -d '\r')
echo "New active user / service principal: $ACTIVEUSER"
