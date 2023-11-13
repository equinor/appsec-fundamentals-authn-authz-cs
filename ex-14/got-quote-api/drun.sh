#!/bin/bash -ex

# For Windows gitbash compability
export MSYS_NO_PATHCONV=1

docker run -p 3200:3200 \
    -it \
    --rm \
    --env PORT=3200 \
    --env HOST="0.0.0.0" \
    --env NODE_ENV=$NODE_ENV \
    --env TENANT_ID=$TENANT_ID \
    --env CLIENT_ID=$CLIENT_ID \
    --env EPISODES_API_URI=$EPISODES_API_URI \
    --env QUOTES_API_URI=$QUOTES_API_URI \
    quote-api