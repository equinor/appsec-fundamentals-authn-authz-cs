#!/bin/bash

# Function that will try to generate invoke jq based on platform

function jqparse() {

    if command -v jq > /dev/null; then
        jq
    elif command -v jq-windows-amd64 > /dev/null; then
        jq-windows-amd64
    else
        echo "No JQ parser" >&2
        return 1
    fi
}

# Function that will try to generate an uuid4 based on platform
function uuid4gen() {
    if command -v uuidgen > /dev/null; then
        uuidgen
    elif command -v powershell > /dev/null; then
        powershell -Command "[guid]::NewGuid().ToString()"
    else
        echo "No UUID generator available" >&2
        return 1
    fi
}

# Function that will try to delete an appregistration if it exists
# $1 - The name of the appregistration to delete
function deleteAppReg() {

    if [ ! $# -gt 0 ]
    then
        printf "Function expects one argument, the appreg name to delete"
        return 1
    fi

    APPREG_TO_DELETE=$(az ad app list --filter "displayname eq '$1'" --query [].appId --output tsv | tr -d '\r' )
    printf "About to delete existing appregistration '%s' '%s' \n" "$1" "$APPREG_TO_DELETE"

    if [ -n "$APPREG_TO_DELETE" ]; then
        printf "Deleting appregistration %s \n" "$APPREG_TO_DELETE"
        az ad app delete --id "$APPREG_TO_DELETE"
    else
        printf "No appregistration found with name %s, nothing to delete \n" "$1"
    fi
    
}

# Function that will return appid for a given appregistration name
# $1 - The name of the appregistration to get the appid for
function getAppId() {

    if [ ! $# -gt 0 ]
    then
        #"Function expects one argument, the appreg name to get the appid for"
        return 0
    fi

    local APPID
    APPID=$(az ad app list --display-name "$1" --output tsv --query [].appId | tr -d '\r')
    #printf "'%s'\n" "$APPID"
    if [ -n "$APPID" ]; then
        echo "$APPID"
    else
        return 0
    fi
    
}

# Function that will return the identifierUri for a given appregistration id
# $1 - The id of the appregistration to get the identifierUri for
function getIdentifierUri() {

    if [ ! $# -gt 0 ]
    then
        #"Function expects one argument, the appreg id to get the identifierUri for"
        return 0
    fi

    local IDENTIFIERURI
    IDENTIFIERURI=$(az ad app show --id $1 --output tsv --query identifierUris[0] | tr -d '\r')

    if [ -n "$IDENTIFIERURI" ]; then
        API_URI=$(echo "$IDENTIFIERURI" | sed 's/api:\/\///g')
        echo "$API_URI"
    else
        return 0
    fi
}

# Function that will return the value part of an element in a .env file
# Element format is KEY="VALUE"
# $1 - The .env file to search
# $2 - The key to search for
function getEnvValue() {

    if [ ! $# -gt 1 ]
    then
        printf "Function expects two arguments, the .env file to search and the key to search for"
        return 1
    fi

    #Try with double quotes
    local VALUE
    VALUE=$(grep "$2" "$1" | grep -oE '".*?"' |  sed 's/"//g')

    #Try with single quotes
    if [ ! -n "$VALUE" ]; then
        local VALUE
        VALUE=$(grep "$2" "$1" | grep -oE "'.*?\'" |  sed 's/"//g')
    fi

    if [ -n "$VALUE" ]; then
        echo "$VALUE"
    else
        return 0
    fi

}
