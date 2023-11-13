#!/bin/bash -e

printf "Using VSCode to diff changes\n"

code --diff  ../ex-02/lib/logger.js lib/logger.js
code --diff  ../ex-02/test/auth-utils.test.js test/auth-utils.test.js
code --diff  ../ex-02/lib/auth-utils.js lib/auth-utils.js
code --diff  ../ex-02/src/app.js src/app.js
code --diff  ../ex-02/src/server.js src/server.js
code --diff  ../ex-02/lib/app-config.js lib/app-config.js
