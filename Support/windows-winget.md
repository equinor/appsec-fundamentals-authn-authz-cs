# Windows setup with `winget`

Below is an example of what to install on a new windows PC. Having `developer profile` on the machine is a pre-requisite

```sh
winget install Microsoft.WindowsTerminal
winget install Microsoft.VisualStudioCode
winget install Mozilla.Firefox
winget install Microsoft.AzureCLI
winget install Git.Git
winget install CoreyButler.NVMforWindows
```

When `git` and `nvm` has been installed, the correct `node` and `npm` version can be installed from git bash or terminal using `nvm`
```sh
nvm install 18.18.0
```

**Setup for automatic scripting of resources**

If you want to use scripts from the `/src/` folder to automate provisioning of Azure resources, `jq` and `uuidgen` needs to be installed and available to the script.

Automatic scripting will be a part of [exercise 14](https://github.com/equinor/appsec-fundamentals-authn-authz/tree/main/ex-14)  

To install `jq`
```sh
winget install jqlang.jq
```

To verify that `uuidgen` is available you can run this command from git bash

```sh
powershell -Command "[guid]::NewGuid().ToString()"
```
