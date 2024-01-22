# Swapping from Node to Python on the Episodes API

In this part we change the technology used on the Episodes API from NodeJS to Python. We continue the journey from ex-10. The API has gotten a few enhancements.

Our Python implementation is not for production - it only serves as a _simple_ example for our exercise.

## Exploring the Python Code (🥸)

The Python version of the Episodes Api lives in `./ex-11/got-episodes-api-python`

Steps:

- (Assuming you have a new terminal session open in `./ex-11/got-episodes-api-python`)
- Observe the highlights in changes to the api code (ex-10 vs. ex-11) 

    ```shell
    ./bin/src-diff.sh
    ```

-- Now You--

- Do the steps above, explore the changes

## Configuring the and preparing the Python API

Steps:

- Assuming you  have a terminal session in `./ex-11/got-episodes-api-python`
- Install Python dependencies

    ```shell
    pip install -r requirements.txt 
    ```
- Execute tests

    ```shell
    pytest 
    ```
--Now You--

- Do the steps above


## Swapping the API's (Executing)

This part assumes that you have the following set-up operational
- The NodeJS version of the Client is running in a terminal session
- The NodeJS version of the Episodes Api is running in terminal session
- The NodeJS version of the Episodes Api is running in terminal session
- The application (The Client) is working ok, Episodes with Quotes can be requested

- We assume you have a terminal session open at `./ex-11/got-episodes-api-python`

Steps:

- Stop the NodeJS Episodes API
- Source your configuration file

    ```shell
    source ~/path-to-env-file/appsec-course-api-episodes-eq.env
    ```
- Start the Python Api

    ```shell
    cd ./src
    ./main.py
    ```

--Now You--

- Do the steps above
- Test the API by
    - Using the Client GUI and the "Show Got Episodes", verify that Quotes are served from the NodeJS Quotes Api
    - (Optional) Exploring the swagger api on PORT 3100 `/doc`     
- Explore the API differences by stopping the Python version and then starting the NodeJS version (back-and-forth)


