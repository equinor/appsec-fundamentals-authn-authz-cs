#!/bin/bash -x

# For Windows gitbash compability
export MSYS_NO_PATHCONV=1

export NODE_ENV=test
docker-compose up --abort-on-container-exit --exit-code-from cypress


# docker-compose up

# docker run -it --rm -v $PWD/client-cypress:/e2e -w /e2e cypress/included:9.1.1 --browser firefox --config baseUrl=http://host.docker.internal:"$CLIENT_PORT"

# # cd client-cypress
# # npm run cypress:run
# # cd ..

# docker-compose down
