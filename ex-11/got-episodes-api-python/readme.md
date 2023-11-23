# Episodes API Python

The is the Episodes API. For authenticated requests the api will return a list of episodes from Game of Thrones.

## Install

```sh
    ▶ pip install -r requirements.txt 
```

## Test

```sh
    TBA
```

## Run


### Config

Expects the following environment variables to execute properly

```sh
    export NODE_ENV=production
    export TENANT_ID=""
    export PORT=3100
    export HOST=0.0.0.0
    export CLIENT_ID=""
    export CLIENT_SECRET=''
    export EPISODES_API_URI=""
    export QUOTES_API_URL=""
    export QUOTES_API_URI=""
```

### Source environments
```sh
    ▶ source "$CFG_ENV_FILE_DIRECTORY/<your_episodes_env_file>"
```

### Run with `main.py`
```
    ▶ cd src
    ▶ ./main.py
```
