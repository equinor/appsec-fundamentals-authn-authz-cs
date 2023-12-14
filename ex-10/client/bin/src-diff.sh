#!/bin/bash -e

printf "Using VSCode to diff changes\n"

code --diff ../../ex-09/test/app.test.js test/app.test.js 
code --diff ../../ex-09/lib/auth-utils.js lib/auth-utils.js 
code --diff ../../ex-09/view/login.hbs view/login.hbs 
code --diff ../../ex-09/view/index.hbs view/index.hbs 
code --diff ../../ex-09/src/app.js src/app.js
code --diff ../../ex-09/lib/app-config.js lib/app-config.js 

