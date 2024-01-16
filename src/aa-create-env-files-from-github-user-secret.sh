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

printf "Extracting config files from %s and saving files to %s\n" "$GH_SECRET_NAME" "$CFG_ENV_FILE_DIRECTORY"

# Create the output folder if it doesn't exist
mkdir -p "$CFG_ENV_FILE_DIRECTORY"

# Fetch the secret from GitHub Codespaces Environment Variable
ENCODED_FILES=${!GH_SECRET_NAME}

# Split the encoded string into an array of encoded files
IFS=' ' read -ra array <<< "$ENCODED_FILES"

for element in "${array[@]}"
do
  # Split the element into filename and encoded content
  IFS=':' read -r -a file <<< "$element"
  
  filename=$(echo "$element" | cut -d':' -f1)
  content=$(echo "$element" | cut -d':' -f2)


  if [ -f "$CFG_ENV_FILE_DIRECTORY/$filename" ]; then
     mv "$CFG_ENV_FILE_DIRECTORY/$filename" "$CFG_ENV_FILE_DIRECTORY/$filename.bak"
  fi

    # Base64 decode the file and save it to the directory
    
    printf "Creating %s\n" "$CFG_ENV_FILE_DIRECTORY/${file[0]}"

    echo "${file[1]}" | base64 --decode > "$CFG_ENV_FILE_DIRECTORY/${file[0]}"

done
