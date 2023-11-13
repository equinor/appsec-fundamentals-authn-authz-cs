# Hints

## ex-14: "host.docker.internal"

* Docker Desktop Mac/Windows:
  
    ```shell
    export EPISODES_API_URL=http://host.docker.internal:3100
    ```

    or

    ```shell
    export EPISODES_API_URL=http://gateway.docker.internal:3100
    ```

    ([docker docs](https://docs.docker.com/desktop/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host))

* Docker Linux - multiple ways of solving this. Adding the following prior to running docker should do the trick (use export if outside the bash script)
  
    ```shell
    DOCKER_IP_ADDRESS=$(ip addr show | grep "\binet\b.*\bdocker0\b" | awk '{print $2}' | cut -d '/' -f 1)

    EPISODES_API_URL="http://"$DOCKER_IP_ADDRESS":3100"
    ```
