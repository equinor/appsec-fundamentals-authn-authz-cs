#!/bin/bash -e

printf "Using VSCode to diff changes\n"


code --diff ../ex-05/test/auth-utils.test.js test/auth-utils.test.js
code --diff ../ex-05/lib/auth-utils.js lib/auth-utils.js 
code --diff ../ex-05/lib/app-config.js lib/app-config.js 