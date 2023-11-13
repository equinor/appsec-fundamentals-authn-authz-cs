# Running multiple containers at once

In this section we will explore running multiple containers which can interact with each other. We will use [docker-compose](https://docs.docker.com/compose/) to do this.

The pattern should be known by now. Build docker images for each component, store config in the environment and refer to this when we start the containers.

Steps:

* Assuming you have in the folder `ex-14/docker`
* Explore the .env file `(path-to-env-files)/(prefix)-appsec-course-Docker-Compose-(pipeline).env`
  * We define 3 services, one for each component (forget about Cypress for now)
  * Each service will build a docker image according to Dockerfile stores in its source
  * We give the container names; client, episodes, quotes. These can be used when referring to them from other components
  * We tell which environment variables that each service would need. These are expected to be available in the environment before we execute using docker-compose.
* Explore `./build.sh` and build the docker images
  
  ```shell
   source ~/(path-to-env-files)/(prefix)-appsec-course-Docker-Compose-(pipeline).env 
   ./build.sh
  ```

* Explore the run script `./run.sh`
  * Using docker-compose to selectively start the components we want
  * Using 'docker-compose up'
  * Could easily be used in scenarios where you local dev of one components while the rest of the dependencies are running in containers - orchestrated by Docker compose.
  * If on Linux, you'll need to handle volume mounts and access to token cache file again. Consult the [FAQ](../../Support/faq.md#docker-volumes---token-cache-file)
* Run

  ```shell
   source ~/(path-to-env-files)/(prefix)-appsec-course-Docker-Compose-(pipeline).env 
   ./run.sh
  ```

* Verify from the browser that the application is running
  * Login, List emails and show episodes
* Observer which containers that are running
  
  ```shell
  docker ps
  ```

* Stop the components

  ```shell
  docker-compose stop
  ```

* Remove all resources created by docker-compose up (network, volumes ++)

  ```shell
  docker-compose down
  ```

----

## --Now You--

* Do the steps above
* If time, experiment with starting and stopping individual components

## --Discuss security issues and good practices--

Now we are at a stage we we can start the complete application, with all dependencies (expect for Azure AD) as a combined unit.
