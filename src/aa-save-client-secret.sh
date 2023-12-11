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

# Ask the user for the content Client client_secret
printf "Enter the content of client_secret for the Client App Registration: "
read -r AAD_CLIENT_CLIENT_SECRET

echo "$AAD_CLIENT_CLIENT_SECRET" | gh secret set "$GH_CLIENT_SECRET_NAME" --user 

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
  https://api.github.com/user/codespaces/secrets/$GH_CLIENT_SECRET_NAME/repositories/$REPO_ID

# Check if the curl command was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to give repository access to the secret"
  exit 1
fi

printf "Sucessfully granted the repo %s (%s) access to %s\'s user secret %s containing the Client appreg client_secret\n" "$GITHUB_REPOSITORY" "$REPO_ID" "$GITHUB_USER" "$GH_CLIENT_SECRET_NAME"