#!/bin/bash -ex

# For Windows gitbash compability
export MSYS_NO_PATHCONV=1

docker run -it --rm -v $PWD:/e2e -w /e2e cypress/included:13.2.0 --browser electron --config baseUrl=http://host.docker.internal:"$CLIENT_PORT"