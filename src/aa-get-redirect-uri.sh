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

# printf "Successfully read config file (%s)\n" "$CONFIG_FILE"

if [ -z "$PORT" ]
then
    printf "Missing PORT environment variable.\n"
    exit 1
fi

if [ -z "$CODESPACE_NAME" ]
then
    printf "Missing CODESPACE_NAME environment variable.\n"
    exit 1
fi

if [ -z "$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN" ]
then
    printf "Missing $GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN environment variable.\n"
    exit 1
fi

echo 'https://'$CODESPACE_NAME'-'$PORT'.'$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN'/'callback