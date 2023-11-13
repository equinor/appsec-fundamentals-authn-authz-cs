# Information on Proxy Setup

Proxy's are components that our network traffic is passing through. In a corp environment these will often inspect and if ok permit the traffic to continue. Encrypted traffic (SSL) will be terminated, decrypted, and inspected as well. This lead to all kind of __interesting__ scenarios.

Explore and potentially source ```./support/proxy.sh``` to get ```proxyon``` and ```proxyoff``` in your bash shell.

`NB!! Most networks in Equinor does not use a proxy anymore (the wpad.dat file will tell)`

## Network level - discovery

Most corp proxy has options for discovery of proxies which the network software on computers know how to handle.

If you are connected to the Equinor corp network (directly or using vpn) the Proxy auto-discovery your query the following address: **http://wpad.statoil.net/wpad.dat**

## Machine - runtime environment

Many applications will query the __environment__ for where to find proxies if they must be used. The 3 most common variables would be HTTP_PROXY, HTTPS_PROXY and NO_PROXY.

The following set-up is needed when working in an equinor environment:
```shell
export HTTP_PROXY="http://www-authproxy.statoil.net:80"
export HTTPS_PROXY="http://www-authproxy.statoil.net:80"
export NO_PROXY=""
```

You could of course download and inspect "http://wpad.statoil.net/wpad.dat" as well.

### Linux

On a linux, mac you would typically include the env. variable inside the initialization script - like "~/.bashrc" (or similar). Many developer working in mixed environments will create a small script or alias to turn on/off proxy settings.

### Windows

On Windows you would typically set the environment variables on system/machine level either using the GUI og command line.

#### GUI

* Select Windows+S
* Search for "Environment variables"
* Select "System properties" or similar
* Select "Advanced" and the "Environment variables"
* Add variables for user or **system**

#### Command

Use the **Set** command

## Applications

Many applications does not acknowledge the environment variables and need to be configured how to use proxies.

### git

```shell
git config --global http.proxy http://[user]@proxyhost:port
git config --global https.proxy http://[user]@proxyhost:port
```

### npm

```shell
npm config set proxy "http://servername:port/"
npm config set https-proxy "http://servername:port/"
```

### Nodejs quirks

To get NodeJs to work with proxies there is a few setting which is nice to know about. For the actual proxying we are using **global-agent**

For certs consider the following settings

```shell
export NODE_EXTRA_CA_CERTS=(CA cert file)
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

For Windows you may have to use the Windows file notation, like export NODE_EXTRA_CA_CERTS=c:\user\username\.certs\certfile.cer

The last one must be used with caution as it will turn acceptance of valid ssl certs on/off.

### Snyk

Please refer to the Snyk [documentation](https://support.snyk.io/hc/en-us/articles/360000925358-How-can-I-use-Snyk-behind-a-proxy-) for using Snyk behind a proxy.

(The Snyk cli is a node application - hence the NodeJs quirks may have an impact)

## Docker / Docker-Compose

* Docker Desktop needs to be told about proxy. Do this in "Preferences->Resources->Proxies"
* Enabling proxies from inside a docker-compose build process, use
  *  --build-arg http_proxy=http://www-authproxy.statoil.net:80 --build-arg https_proxy=http://www-authproxy.statoil.net:80 
* Enabling proxies for services in docker-compose, define
  * https_proxy and http_proxy as environment variables in docker-compose.yml 
* The Docker Engine may need additional proxy config, consult the official [Configure Docker to use a Proxy](https://docs.docker.com/network/proxy/) documentation for the required settings in ```~/.docker/config.json```.
* Enabling proxy inside a docker build command, use --build-arg http_proxy=http://www-authproxy.statoil.net:80 --build-arg https_proxy=http://www-authproxy.statoil.net:80 