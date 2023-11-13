#!/bin/bash -e

printf "Creating .env from templates.\n::Keep the .env in a protected location and out of soure control!!\n"

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

if [ -z "$CFG_ENV_FILE_DIRECTORY" ]
then
    printf "Config var for env files not set (%s) folder\n" "$CFG_ENV_FILE_DIRECTORY"
    exit 1
fi

if [ ! -d "$CFG_ENV_FILE_DIRECTORY" ];
then
    printf "Directory for env files does not exist (%s), exiting\n" "$CFG_ENV_FILE_DIRECTORY"
    exit 1
fi


# Check if the client env file exists, if not copy the template
if [ ! -f "$CFG_ENV_FILE_DIRECTORY$CFG_ENV_CLIENT_FILENAME" ];
then
    printf ":: CLIENT, .env config file for client does not exist, creating new with template\n"
    cp "$SCRIPTDIR"/templates/client.env.template "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_CLIENT_FILENAME"
else

    printf ":: CLIENT, .env config file for client exists, not copying template\n"
    printf ":: CLIENT, Delete exisiting file to refresh with template\n"
    
fi

# Check if the episodes api env file exists, if not copy the template
if [ ! -f "$CFG_ENV_FILE_DIRECTORY$CFG_ENV_EPISODES_FILENAME" ];
then
    printf ":: EPISODES, .env config file for episodes does not exist, creating new with template\n"
    cp "$SCRIPTDIR"/templates/episodes.env.template "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_EPISODES_FILENAME"
else

    printf ":: EPISODES, .env config file for episodes exists, not copying template\n"
    printf ":: EPISODES, Delete exisiting file to refresh with template\n"
    
fi

# Check if the Quote api env file exists, if not copy the template
if [ ! -f "$CFG_ENV_FILE_DIRECTORY$CFG_ENV_QUOTE_FILENAME" ];
then
    printf ":: QUOTE, .env config file for quote does not exist, creating new with template\n"
    cp "$SCRIPTDIR"/templates/quote.env.template "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_QUOTE_FILENAME"
else

    printf ":: QUOTE, .env config file for quote exists, not copying template\n"
    printf ":: QUOTE, Delete exisiting file to refresh with template\n"
    
fi

# Check if the Docker compose api env file exists, if not copy the template
if [ ! -f "$CFG_ENV_FILE_DIRECTORY$CFG_ENV_DOCKER_COMPOSE_FILENAME" ];
then
    printf ":: DOCKER COMPOSE, .env config file for Docker Compose does not exist, creating new with template\n"
    cp "$SCRIPTDIR"/templates/compose.env.template "$CFG_ENV_FILE_DIRECTORY""$CFG_ENV_DOCKER_COMPOSE_FILENAME"
else

    printf ":: DOCKER COMPOSE, .env config file for client exists, not copying template\n"
    printf ":: DOCKER COMPOSE, Delete exisiting file to refresh with template\n"
    
fi


