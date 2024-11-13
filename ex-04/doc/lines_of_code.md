# Lines of Code - Dependency Scanning (🥸)

In this section we will explore some of the impact using open source frameworks and modules has on our project.

## --Code Analysis--

Counting approx lines of JavaScript/TypeScript code in project, our own code and code in modules/frameworks.</br>(We have used **cloc** to do the counting)

| Part | EX-2 | EX-4 |
| ---  | ---  | ---  |
| Exercise JS LOC   | 811  |  852 |
| Modules JS LOC   | 1.384.607  | 1.435.897  |
| % own code | 0.058% | 0.059% |
| Direct Node Modules | 16 | 16 |
| Indirect Node Modules | 352 | 369 |

Steps:

You will use the command line for the next steps
* Stop the application if it's running, navigate to the `./ex-04` directory

* Use CLOC to analyse code, observe technologies in use, lines of code etc.
* Our own code

    ```shell
    cloc . --exclude-dir=node_modules
    ```

* Installed dependencies

    ```shell
    cloc node_modules
    ```

* Notice that we have 30 technologies/languages/systems in use!

## --Now You--

* Do the steps

## --Dependency scanning--

The patterns shown above is not unique to the JavaScript environment - it is more or less how it is these days. From a security perspective we should be able analyses issues in our own code - but what about the 85-95% of the code we have not written ourselves?

This is where open source dependency scanning could make a difference. In Equinor we use [Snyk](https://snyk.io/) to scan open source dependencies for known vulnerabilities. Scanning of source code is mandatory in Equinor. Read more about Snyk at [appsec.equinor.com](https://appsec.equinor.com/snyk/) ⚡️

Snyk provide:

* Open source dependency vulnerability scanning
* Open source license issues
* Vulnerability scanning of container images
* Static code analysis
* Scanning for vulnerabilities in infrastructure as code files
* The Snyk vulnerability database
* The Snyk advisor (providing detailed intel on dependencies and projects)
