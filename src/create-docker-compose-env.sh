#!/bin/bash -e

#
# Creating the docker compose .env file. The .env files for client, episodes and quote need to exist and be up to date
#

SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE}" )" >/dev/null && pwd )"

if [ -z "$PIPELINE" ]
then
    printf "Missing PIPELINE environment variable.\nValue must match a file in the ./config folder"
    exit 1
fi

CONFIG_FILE="$SCRIPTDIR/config/$PIPELINE.cfg"
FUNCTIONS_FILE="$SCRIPTDIR/functions.sh"

if [ ! -f  "$CONFIG_FILE" ]
then
    printf "Unable to find config file $CONFIG_FILE\n"
    exit 1
fi

source "$CONFIG_FILE" 2> /dev/null
source "$FUNCTIONS_FILE" 2> /dev/null

printf "Successfully reading config file ($CONFIG_FILE)\n"


printf "About to update .env file ($CFG_ENV_FILE_DIRECTORY$CFG_ENV_DOCKER_COMPOSE_FILENAME)\n"

printf "Updating the Common section"   

printf ":: TENANT_ID\n"
sed -i'.bkup' 's/TENANT_ID=.*/TENANT_ID="'"$CFG_TENANT_ID"'"/' $CFG_ENV_FILE_DIRECTORY$CFG_ENV_DOCKER_COMPOSE_FILENAME

printf "Updating the Client section\n"   

CLIENT_CLIENT_ID=$(getEnvValue $CFG_ENV_FILE_DIRECTORY$CFG_ENV_CLIENT_FILENAME "CLIENT_ID")
printf ":: CLIENT_CLIENT_ID\n"
sed -i'.bkup' 's/CLIENT_CLIENT_ID=.*/CLIENT_CLIENT_ID="'"$CLIENT_CLIENT_ID"'"/' $CFG_ENV_FILE_DIRECTORY$CFG_ENV_DOCKER_COMPOSE_FILENAME

CLIENT_CLIENT_SECRET=$(getEnvValue $CFG_ENV_FILE_DIRECTORY$CFG_ENV_CLIENT_FILENAME "CLIENT_SECRET")
printf ":: CLIENT_CLIENT_SECRET\n"
sed -i'.bkup' 's/CLIENT_CLIENT_SECRET=.*/CLIENT_CLIENT_SECRET='"$CLIENT_CLIENT_SECRET"'/' $CFG_ENV_FILE_DIRECTORY$CFG_ENV_DOCKER_COMPOSE_FILENAME

printf "Updating the Episodes section\n"   

EPISODES_CLIENT_ID=$(getEnvValue $CFG_ENV_FILE_DIRECTORY$CFG_ENV_EPISODES_FILENAME "CLIENT_ID")
printf ":: EPISODES_CLIENT_ID\n"
sed -i'.bkup' 's/EPISODES_CLIENT_ID=.*/EPISODES_CLIENT_ID="'"$EPISODES_CLIENT_ID"'"/' $CFG_ENV_FILE_DIRECTORY$CFG_ENV_DOCKER_COMPOSE_FILENAME

EPISODES_CLIENT_SECRET=$(getEnvValue $CFG_ENV_FILE_DIRECTORY$CFG_ENV_EPISODES_FILENAME "CLIENT_SECRET")
printf ":: EPISODES_CLIENT_SECRET\n"
sed -i'.bkup' 's/EPISODES_CLIENT_SECRET=.*/EPISODES_CLIENT_SECRET='"$EPISODES_CLIENT_SECRET"'/' $CFG_ENV_FILE_DIRECTORY$CFG_ENV_DOCKER_COMPOSE_FILENAME

EPISODES_API_URI=$(getEnvValue $CFG_ENV_FILE_DIRECTORY$CFG_ENV_EPISODES_FILENAME "EPISODES_API_URI")
printf ":: EPISODES_API_URI\n"
sed -i'.bkup' 's/EPISODES_API_URI=.*/EPISODES_API_URI="'"$EPISODES_API_URI"'"/' $CFG_ENV_FILE_DIRECTORY$CFG_ENV_DOCKER_COMPOSE_FILENAME

printf "Updating the Quote\n"
QUOTES_API_URI=$(getEnvValue $CFG_ENV_FILE_DIRECTORY$CFG_ENV_QUOTE_FILENAME "QUOTES_API_URI")
printf ":: QUOTES_API_URI\n"
sed -i'.bkup' 's/QUOTES_API_URI=.*/QUOTES_API_URI="'"$QUOTES_API_URI"'"/' $CFG_ENV_FILE_DIRECTORY$CFG_ENV_DOCKER_COMPOSE_FILENAME
