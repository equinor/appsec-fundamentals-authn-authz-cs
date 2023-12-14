#!/bin/bash -e

printf "Using VSCode to diff changes\n"

code --diff ../../ex-10/got-episodes-api-python/src/routes/episodes.py src/routes/episodes.py
code --diff ../../ex-10/got-episodes-api-python/src/controller/episodes_controller.py src/controller/episodes_controller.py
code --diff ../../ex-10/got-episodes-api-python/src/data/models.py src/data/models.py
code --diff ../../ex-10/got-episodes-api-python/src/core/config.py src/core/config.py
code --diff ../../ex-10/got-episodes-api-python/src/core/auth.py src/core/auth.py

