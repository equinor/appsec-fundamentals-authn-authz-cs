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

gh secret delete "$GH_CLIENT_SECRET_NAME" --user 

# Check if the curl command was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to delete the secret (%s)" "$GH_CLIENT_SECRET_NAME"
  exit 1
fi

printf "Successfully deleted the secret (%s)\n" "$GH_CLIENT_SECRET_NAME"
