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

Also visit application important settings in `appsettings.json` and correct all fieds for validation of JWT token

```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "TenantId": "<TENANT_ID>",
    "ClientId": "<QUOTE_CLIENT_ID>",
    "Jwt": {
      "Authority": "https://login.microsoftonline.com/<TENANT_ID>/v2.0/",
      "TokenValidationParameters": {
        "ValidateIssuer": true,
        "ValidIssuer": "https://sts.windows.net/<TENANT_ID>/",
        "ValidateAudience": true,
        "ValidAudience": "api://<QUOTE_URI>",
        "ValidateLifetime": true,
        "ValidateIssuerSigningKey": true
      }
    },
  },
}

```

### Execute

```sh
    $ cd src
    $ dotnet run
```

Swagger will be available at `/swagger` without Authorization