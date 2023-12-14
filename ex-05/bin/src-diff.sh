#!/bin/bash -e

printf "Using VSCode to diff changes\n"

code --diff ../ex-04/test/auth-utils.test.js test/auth-utils.test.js 
code --diff ../ex-04/lib/auth-utils.js lib/auth-utils.js 
code --diff ../ex-04/view/index.hbs view/index.hbs 
code --diff ../ex-04/view/layouts/main.hbs view/layouts/main.hbs
code --diff ../ex-04/src/app.js src/app.js
code --diff ../ex-04/lib/app-config.js lib/app-config.js 

