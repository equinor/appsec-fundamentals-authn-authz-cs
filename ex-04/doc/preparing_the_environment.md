# Preparing the development environment

In this part we will prepare the development environment for executing the web application.

Steps:

* You will use the (bash)command line for the next steps
* Navigate to the "./ex-04" directory
* Verify the NodeJS environment

```shell
node --version
```

```shell
npm --version
```

* Node should be around v18.18.0 and NPM v10.0.1
* Install dependencies </br>(You want to consult the [Proxy Guide](../doc/../../doc/md/proxy.md) if you have connectivity issue)
* Notice: The NODE_ENV variable guides NPM. NODE_ENV=production will tell NPM to only install [production dependencies](https://docs.npmjs.com/cli/v8/commands/npm-install).

```shell
npm install
```

* Execute tests

```shell
npm test
```

## --Now You--

* Do the steps
* When done post the output the last two lines of the **npm test** command to the course Slack channel
