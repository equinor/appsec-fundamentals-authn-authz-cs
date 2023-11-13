#!/bin/bash -e

printf "Using VSCode to diff changes\n"

code --diff ../../ex-10/got-episodes-api/lib/app-config.js lib/app-config.js 