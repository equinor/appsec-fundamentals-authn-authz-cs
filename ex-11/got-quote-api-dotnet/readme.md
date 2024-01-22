# Quote API DotNet

The is the Quotes API. For authenticated requests the api will return a random quote from Game of Thrones

## Install

```sh
    $ dotnet build
```

## Test

```sh
    $ dotnet test
```

## Run

### Config

Expects the following environment variables to execute properly

```sh
    export NODE_ENV=development
    export TENANT_ID=""
    export PORT=3200
    export QUOTES_API_URI=""
    export EPISODES_API_URI=""
```

### Execute

```sh
    $ cd src
    $ dotnet run
```

Swagger will be available at `/swagger` without Authorization