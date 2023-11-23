# Workshop Preparations

Prior to joining the workshop the preconditions below should be met. This means that roles need to be active and the software on your local development environment should be tested and verified working.

We assume that participant:

- You need a laptop with access to the internet
- You need an updated and modern browser (like Firefox)
- You need access to the [Equinor](https://github.com/equinor) organizations on [github.com](https://github.com). Test this by using the SSO end-points, [https://github.com/orgs/equinor/sso](https://github.com/orgs/equinor/sso)
- *Some basic knowledge of the Linux command line and bash are always useful*
- *Knowledge og Javascript and Python will be helpful*

---

### Accounts & Roles

* [Azure Application Developer](https://docs.omnia.equinor.com/governance/iam/App-General-Info/) role (requires Equinor Software developer on-boarding)

__Windows__:

* The [Windows 10 Developer Profile](https://accessit.equinor.com/Search/Search?term=windows+10+developer) for your laptop
* Using the [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) package managers seems like a good option to install dev tools. See [Windows WinGet Installs](windows-winget.md) for a complete setup

#### Day 3-4

* Own Account at [Office365 Developer](https://developer.microsoft.com/en-us/microsoft-365/dev-program) program.
  * [Office 365 Developer How-To](o365_dev_howto.md)
  * Sample data packs loaded into tenant (users)

---

### Installed Software

#### Day 1 - 2

* Visual Studio Code - [Visual Studio Code](https://code.visualstudio.com/)
  * Make sure VSCode can be started from the command line ([link](https://code.visualstudio.com/docs/editor/command-line#_launching-from-command-line))
* A modern browser. For security and privacy reasons, we `strongly recommend` using [Firefox](https://www.mozilla.org/en-US/firefox/new/)
* [NodeJS](https://nodejs.org/en/download/) (Tested with v18.18.0 lts/Hydrogen, NPM version 10.1.0)
* Git and Github (using ssh keys to authenticate)

* __Windows__
  * Gitbash (Install from Equinor Applications)
  * The new [Windows Terminal](https://aka.ms/terminal) is `strongly recommended`!

#### Day 3 - 4

* [OWASP Zap Proxy](https://www.zaproxy.org/)(tested with v 2.13.0)
* Docker / [Docker Desktop](https://www.docker.com/products/docker-desktop)
  * Docker Desktop usually contains both the Docker engine and Docker compose.
  * Docker (engine v24.0.5)
  * Docker-Compose ([install](https://docs.docker.com/compose/install/))
  * We are using v3.8 of the compose file versioning, this required Docker Engine release => 19.03.0 ([ref](https://docs.docker.com/compose/compose-file/compose-versioning/))
    * Use ```docker version``` to validate your engine version
* Curl
  * (For Windows, use the curl implementation in gitbash)
* Command line tools (bash)
  * [Azure cli](https://learn.microsoft.com/en-us/cli/azure/?view=azure-cli-latest)
  * [jq](https://jqlang.github.io/jq/)
  * [sed](https://manpages.ubuntu.com/manpages/trusty/man1/sed.1.html)
  * [grep](https://manpages.ubuntu.com/manpages/trusty/man1/grep.1.html)
  * uuidgen (part of MSYS2 on Windows, install using [winget](windows-winget.md))

---

### Networking

The workshop is prepared using IPv4. Having IPv6 active may give issues that you need to be able to solve on your own :)

---

### Github Codespaces

There will be an opportunity to use Github Codespaces as the development environment during the workshop. We will treat this an experimental route. You must be prepared for some deviations and should preferably have done some testing on Codespaces prior to joining the workshop. We don't intend to spend much time in the workshop on the necessary adaptions - but some discussion could be helpful.

You need a local development environment running for some of the exercises!

Please be aware of the following:

* We have not done a Security Risk Assessment (SRA) of Github Codespaces. Any usage need to consider this in their risk model.
  * Risky elements in our workshop will typically involve token cache, client secrets, logs, ports and running in a multi tenant environment.
  * Client secrets should be entered using the secrets mechanism of [Codespaces](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-encrypted-secrets-for-your-codespaces). Parts of the workshop config needs to be adapted accordingly.
  * Forwarded ports that are made public is a security risk
* Codespaces will typically forward __local ports__ which becomes available to your browser or your local VSCode.

* When doing development in the browser, or for public forwarded ports, the redirect uri will be become dynamic and the PAWA code needs to be updated (as well as the relevant AAD objects)
* Exercises involving a "native" front-end (like Owasp Zap, Cypress) works best with running the code on your local computer. Cypress and Owasp Zap can be made to run inside containers and having an intermediate X11 server creating a UI in the browser. Technically this works, but not very well.
* The exercise on "Inspecting the Back-Channel" involved proxying of http/https traffic when running on your local computer. Expect "some additional" work to make this run in a container environment (the proxy set-up, hosts and networking)
* The exercise on "Integration testing" involves using Cypress. Parts of this work involves controlling the browser and needs to be executed locally. The end-scenario running headless works like a charm.
  
Relevant information:

* Codespaces on in the Visual Studio Code [docs](https://code.visualstudio.com/docs/remote/codespaces)
* Github [docs](https://docs.github.com/en/codespaces) for Codespaces.
* The [#codespaces channel](https://equinor.slack.com/archives/C02J6J83L3G) on Equinor's slack workspace
