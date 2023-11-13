#!/bin/bash -ex

# For Windows gitbash compability
export MSYS_NO_PATHCONV=1

docker run -p 3000:3000 \
    -it \
    --rm \
    -v $HOME/.tcache:/usr/src/app/data \
    --env HOST="0.0.0.0" \
    --env PORT=3000 \
    --env NODE_ENV=$NODE_ENV \
    --env REDIRECT_URI="http://localhost:${PORT}/callback" \
    --env TENANT_ID=$TENANT_ID \
    --env CLIENT_ID=$CLIENT_ID \
    --env CLIENT_SECRET=$CLIENT_SECRET \
    --env EPISODES_API_URI=$EPISODES_API_URI \
    --env EPISODES_API_URL=$EPISODES_API_URL  \
    --env TOKEN_CACHE_FILE="./data/cache.json"  \
    --env TEST_CLIENT_USERNAME=$TEST_CLIENT_USERNAME \
    --env TEST_CLIENT_PASSWORD=$TEST_CLIENT_PASSWORD \
    client