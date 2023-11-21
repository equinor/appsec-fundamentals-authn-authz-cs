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

# Initialize the variable to store the base64 encoded content
ENCODED_FILES=""

# Use GitHub CLI to set the secret in Codespaces
printf "Storing env files from %s into user codespace secret %s\n" "$CFG_ENV_FILE_DIRECTORY" "$GH_SECRET_NAME"

for file in "$CFG_ENV_FILE_DIRECTORY"/*.env
do
    if [ -f "$file" ]; then
        FILENAME=$(basename "$file")
        ENCODED_FILES+="$FILENAME:"$(base64 -w 0 "$file")" "
        printf "Adding %s\n" "$FILENAME"
    fi
done

echo "$ENCODED_FILES" | gh secret set "$GH_SECRET_NAME" --user 

# Grant access to the secret for the Codespace

REPO_INFO=$(curl --silent -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$GITHUB_REPOSITORY)

# Check if the curl command was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to fetch repository information"
  exit 1
fi

REPO_ID=$(echo $REPO_INFO | jq .id)

# Check if the jq command was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to parse repository information"
  exit 1
fi


curl -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/codespaces/secrets/$GH_SECRET_NAME/repositories/$REPO_ID

# Check if the curl command was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to give repository access to the secret"
  exit 1
fi

printf "Sucessfully granted the repo %s (%s) access to %s\'s user secret %s containing config files\n" "$GITHUB_REPOSITORY" "$REPO_ID" "$GITHUB_USER" "$GH_SECRET_NAME"