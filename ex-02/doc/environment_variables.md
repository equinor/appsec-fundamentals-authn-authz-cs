# Environment Variables

In this part we will start to investigate how we move dynamic configuration parameters out of the code and into environment variables.

Steps:

* Configure the environment variables for the application<br/>(As documented in the [readme.md](../readme.md))

```shell

export NODE_ENV=production
export CLIENT_SECRET='the client secret from the AD app object'
export CLIENT_ID="the client id from the AD app object"
export TENANT_ID="the tenant id"
export PORT=3000
```

## --Now You--

* In the terminal window you have active from [preparing the environment](./preparing_the_environment.md)
  * Configure the environment variables for your app

## --Discuss security issues and good practices--

* A good practice is to move config into files, potentially **.env** files
  * The .env files should be stored outside the code repository
  * The .env files should be included in .gitignore
* Establish good overview over which config that needs to be treated as secrets and which does not

