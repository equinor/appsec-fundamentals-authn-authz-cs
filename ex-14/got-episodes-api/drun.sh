#!/bin/bash -ex

# For Windows gitbash compability
export MSYS_NO_PATHCONV=1

docker run -p 3100:3100 \
    -it \
    --rm \
    --env PORT=3100 \
    --env HOST="0.0.0.0" \
    --env NODE_ENV=$NODE_ENV \
    --env REDIRECT_URI="http://localhost:3000/callback" \
    --env TENANT_ID=$TENANT_ID \
    --env CLIENT_ID=$CLIENT_ID \
    --env CLIENT_SECRET=$CLIENT_SECRET \
    --env EPISODES_API_URI=$EPISODES_API_URI \
    --env QUOTES_API_URI=$QUOTES_API_URI \
    --env QUOTES_API_URL=$QUOTE_API_URL \
    episodes-api