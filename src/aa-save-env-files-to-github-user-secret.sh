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

# Define the GitHub Codespace secret name
SECRET_NAME="ENVFILES"

# Initialize the variable to store the base64 encoded content
ENCODED_FILES=""

for file in "$CFG_ENV_FILE_DIRECTORY"/*
do
    if [ -f "$file" ]; then
        FILENAME=$(basename "$file")
        ENCODED_FILES+="$FILENAME:$(base64 "$file")\nEND-OF-FILE\n"
    fi
done

# Use GitHub CLI to set the secret in Codespaces
printf "Storing env files from %s into user codespace secret %s\n" "$CFG_ENV_FILE_DIRECTORY" "$SECRET_NAME"

echo "$ENCODED_FILES" | gh secret set "$SECRET_NAME" --user 

# Grant access to the secret for the Codespace

REPO_INFO=$(curl --silent -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$GITHUB_REPOSITORY)

REPO_ID=$(echo $REPO_INFO | jq .id)

curl --silent -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/codespaces/secrets/$SECRET_NAME/repositories/$REPO_ID

printf "Sucessfully granted the repo %s (%s) access to %s\'s user secret %s containing config files\n" "$GITHUB_REPOSITORY" "$REPO_ID" "$GITHUB_USER" "$SECRET_NAME"