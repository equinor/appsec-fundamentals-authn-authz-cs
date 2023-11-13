# Lines of Code - Dependency Scanning

In this section we will explore the impact using frameworks has on the amount of code in our projects.

## --Code Analysis--

Counting lines of JavaScript code in project, my own code and code in modules/frameworks. (We have used **cloc** to do the counting)

| Part | EX-2 | EX-4 |
| ---  | ---  | ---  |
| Exercise JS LOC   | 1022  |  842 |
| Modules JS LOC   | 1.542.022  | 1.566.238  |
| % own code | 0.066% | 0.053% |
| Direct Node Modules | 16 | 16 |
| Indirect Node Modules | 382 | 391 |

## --Dependency scanning--

The patterns shown above is not unique to the JavaScript environment - it is more or less how it is these days. From a security perspective we should be able analyses issues in our own code - but what about the 99.9% of the code we have not written ourselves?

This is where open source dependency scanning could make a difference. In Equinor we use Snyk do to open source dependency scanning. Scanning of source code is mandatory in Equinor. Read more about Snyk at [appsec.equinor.com](https://appsec.equinor.com/snyk/)

Snyk provide:

* Open source dependency vulnerability scanning
* Open source license issues
* Vulnerability scanning of container images
* Static code analysis
* Scanning for vulnerabilities in infrastructure as code files
* The Snyk vulnerability database
* The Snyk advisor (providing detailed intel on dependencies and projects)
