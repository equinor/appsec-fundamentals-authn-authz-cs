# Secrets

Let's spend a bit more time on discussing secrets -- and how to handle them.

Steps:

* Move your config into a .env file outside the source folder
  * File name: appsec-course-client-eq.env
  * Should contain the export statements
* Using a new **fresh** terminal window, source the file and run the application

```shell
source ~/path-to-env-file/appsec-course-client-eq.env
npm start
```

## --Now You--

* Do the steps
* When done - offer your help to other participants

## --Discuss security issues and good practices--

* Good practice - Keep secrets out of version control
* Good practice - Inject secrets to apps using environment variables (assumes that you trust the client!)
* Good practice - Use keyvault to store secrets
  * The **identity** that is used to read the vault should have the least possible privilege level
* Good Practice - Use Managed Service Identities (MSI) to read secrets from keyvault
  * Observe: This is NOT a 100% secure solution. It still requires high confidence/trust into client environment
* Good Practice - Rotate secrets often - preferably automated
* Good Practice - MS Recommend using Certificates (non self signed for production) rather than client secret "strings"
  * Anyone have experience with this pattern? What's the root CA that's used?
* Good Practice - Scan for Secrets in your dev environment. The AppSec Team has workshops on this as well, the [AppSec Fundamentals Secret Scanning](https://github.com/equinor/appsec-fundamentals-secret-scanning) workshop.
