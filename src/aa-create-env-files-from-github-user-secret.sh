#!/bin/bash -ex

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

# Define the GitHub Codespace secret name
SECRET_NAME="ENVFILES"

# Create the output folder if it doesn't exist
mkdir -p "$CFG_ENV_FILE_DIRECTORY"

# Fetch the secret from GitHub Codespaces Environment Variable
ENCODED_FILES=${!SECRET_NAME}

# Counter for naming files
COUNTER=1

# Split the encoded string by the 'END-OF-FILE' delimiter and decode each part
IFS=$'\n' # Split on newline characters
for block in $(echo "$ENCODED_FILES" | sed 's/END-OF-FILE/\n/g'); do
    if [ ! -z "$block" ]; then
        FILENAME=${block%%:*}
        CONTENT=${block#*:}

        if [ -f "$CFG_ENV_FILE_DIRECTORY/$FILENAME" ]; then
            mv "$CFG_ENV_FILE_DIRECTORY/$FILENAME" "$CFG_ENV_FILE_DIRECTORY/$FILENAME.bak"
        fi

        echo "$CONTENT" | base64 --decode > "$CFG_ENV_FILE_DIRECTORY/$FILENAME"
    fi
done
