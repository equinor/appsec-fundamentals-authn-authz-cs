# Frequently Asked Questions

## Gitbash - NodeJS - Windows vs. POSIX

One option for doing the workshop is to use Windows and then Gitbash to get a Linux like shell. Windows and Linux uses different path notations (Windows vs. POSIX) (example ```c:\myfile.txt``` vs ```/c/myfile.txt```))

Gitbash 'simulates' a Linux shell, but the programs that are executed will be Windows program. In order to be helpful, Gitbash will convert path arguments for these programs from POSIX to Windows format.

This may be helpful, but could also lead to a few issues. You have a few options:

1) Use Gitbash as is, but be observant of POSIX paths that are converted (they may not be on the expected format)

2) Use ```export MSYS_NO_PATHCONV=1``` in the shell to stop Gitbash (or more correctly MSYS) from convert paths. All paths should then be given on Windows format.

3) Specific Windows path argument when using Gitbash under Windows.

## WSL - Windows Subsystem for Linux

Some developers are using [WSL](https://docs.microsoft.com/en-us/windows/wsl/) which is a good alternative for doing software development. We are collecting some experiences with using WSL in the workshop.

* ```docker compose``` vs ```docker-compose```
  * When using docker-compose in ex-14 with headless testing some users reports that this works with ```docker compose``` but not ```docker-compose```. We assume this is somewhat related to which version of WSL you are using and how this is integrated, or not, with the Docker Desktop for Windows.
* **ex-13, inspecting back-channel**
  * Installing ZAP directly on subsystem is preferable to installing on host due to easier network setup.
  * See [windows-wsl](/Support/windows-wsl.md) for more information
* **ex-14, integration testing**
  * The container-user might have insufficient rights to update token cache. Modify rights on `~/.tcache/cache.json` to fix that.
  * If installing **cypress** on ubuntu subsystem with `npm`, you might need additional system libraries. See [windows-wsl](/Support/windows-wsl.md) for details
  * Cypress in docker on WSL should either be run together with all the other containers, or with `npm run cypress:open` or `npm run cypress:run` directly on subsystem (this to avoid mixing up `localhost` and `host.docker.internal` in authentication flows)

## NODE_ENV observations

* We use the NODE_ENV environment variable to drive some logic in our code (like logging levels)
* The NODE_ENV variables is also used to [configure](https://docs.npmjs.com/cli/v6/using-npm/config) [NPM](https://docs.npmjs.com/about-npm) - the default package manager for javascript. (It's not an acronym for Node Package Manager :)
  * If NODE_ENV=production, _npm_ will only install production dependencies, dev-dependencies are omitted.
  * If you have NODE_ENV=production, do an ```npm install``` and then ```npm test``` or ```npm run dev``` they will usually fail, because modules needed for testing and development will be installed as dev-dependencies.

## Installing self signed root CA certificates

* We will use self signed root CA certificate when doing "inspecting the back channel".
* Consult the OWASP ZAP [doc](https://www.zaproxy.org/docs/desktop/ui/dialogs/options/dynsslcert/) for installing on Windows/Internet Explorer and Mozilla Firefox.
* The root CA's can be installed and used for the specific http clients that will use them, or they can be installed on the "operating system level". We do not recommend using the operating system cert store for storing self signed CA certs in the  workshop.
* Google Chrome currently uses cert stores on OS level. </br>This may change in the future as part of the [Chrome Root Program](https://g.co/chrome/root-policy)
* If needed, import CA certs using the **Windows Cert Manager**, the MacOs **Keychain access** or follow the appropriate guide for you _Linux_ distribution.

## Windows Curl

On Windows you will typically have different implementations of Curl for PS, CMD and GitBash. The windows version of Curl does not accept self signed CA certificates unless they're installed in the os cert store ([link](https://www.phillipsj.net/posts/windows-curl-and-self-signed-certs/)).

For the purpose of this course on Windows, use the gitbash implementation.

Doing a `curl --version` should indicate curl 7.xx (x86_64_w64-mingw32) ....

Some times curl are not able to access the CRL lists. If you get error message indicating this (CERT_TRUST_REVOCATION_STATUS_UNKNOWN) you can use the `--ssl-no-revoke` option with curl. This will reduce the SSL security level, but does not represent an issue in our case since we have self generated CA that not are part of the official lists anyway.

## Docker volumes - token cache file

When using Docker we are using a volume mount to persist the token cache outside the container. Depending on your system set-up and where you are storing the token cache you may have to configure Docker (the Docker process, engine) to read and write to the volume.

Assuming you store the token cache in `$HOME/.tcache/`

* Using **Docker Desktop** for Mac or Windows should require no changes (as the docker engine should in normal circumstances have read/write to the home directory)
* Using **Linux** in a setup with the **docker** group (avoiding using sudo to run docker), you could run the docker container as your current user with the following addition to the ```docker run``` commands:</br>
    ```--user $(id -u)```
* Using **Linux** and **docker-compose**. Again we need to tell docker-compose to use your current user if the cache file is stored in the default location.
  * The ```docker-compose.yml``` file should be altered. For the ```client``` service replace ``` user: "1001:1001" ``` with ```user: ${CURRENT_USER}```.
  * We need to populate the ```CURRENT_USER``` environment variable with proper values. The basic command for this is

    ```shell
    export CURRENT_USER=$(id -u):$(id -g)
    ```

  * Use this value with docker-compose, either by adding the export statement prior to running the docker-compose command in ```./run.sh``` and ```./test.sh``` or by doing the export prior to running docker-compose

    ```shell
    CURRENT_USER=$(id -u):$(id -g) docker-compose up client episodes quotes
    ```

## host.docker.internal

In some cases we need to refer to the internal docker host ip, or the bride network used by Docker.

The internal host ```host.docker.internal``` will work with Docker Desktop for Windows and Mac.

This host is **only available** for very new versions of docker engine on Linux.

Rather than referring to ```docker.host.internal``` on linux, extract the host ip into an environment variable using a command like the following

```shell
DOCKER_IP_ADDRESS=$(ip addr show | grep "\binet\b.*\bdocker0\b" | awk '{print $2}' | cut -d '/' -f 1)
```

DOCKER_IP-ADDRESS should then be used when referring to the docker host in docker run or docker-compose.
