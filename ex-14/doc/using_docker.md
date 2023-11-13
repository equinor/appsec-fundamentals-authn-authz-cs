# Using Docker and Containers

In this section we will explore putting our components inside Docker images and running them in containers. This will be an important step on the way to more automation.

We assume that you have access to a docker environment like [Docker Desktop](https://www.docker.com/products/docker-desktop).

## The Client

Steps:

* Assuming you are in the `ex-14/client` folder
* Examine the `./Dockerfile`
  * This is multi-stage build file
  * We build, test and then bake the final image if things are ok.
* Build the client docker image and tag it as "client"

  ```shell
  docker build -t client .
  ```

* Explore the script `./drun.sh`
  * This script shows the command to run the docker image
  * It will start the client container and inject the necessary config from the environment
  * We use a volume (-v) to map a storage for persistence of the token cache outside of the container
    * Update the volume mapping to reflect your local environment!
    * Consult the [FAQ](../../Support/faq.md#docker-volumes---token-cache-file) for more info on Docker volumes.
* Explore the config file for the client, source it and run the script

  ```shell
  source /(path-to-env-file)/(prefix)-appsec-course-Client-client-(pipeline).env
  ./drun.sh
  ```

* Assuming the other components (Episodes, Quotes) are running
  * Login to the app in test mode
    * (Remember that test mode is triggered by the value stored in NODE_ENV)
  * Why does not "Show GOT Episodes" work?
* Fix the issue, execute and verify
  * Hint: It's in a config param[.](../../Support/hints.md)

## --Now You--

* Do the steps above
* Solve the issue
* Verify that you are able to use the application when
  * The Client is running in a container
  * The Episodes api is running in a terminal session
  * The Quotes api is running in a terminal session

## --Discuss security issues and good practices--

We can follow the same pattern for all our component, create docker image, use the existing config and the component inside a container. For the exercise we will not do this for the reminding components

