# Swapping from Node to Python on the Episodes API

In this part we change the technology used on the Episodes API from NodeJS to Python. The purpose is to explore how _easy_ it is to include technologies as long as the contract is the same. We also want to make a simple Python example available. The functionality between the NodeJS implementation and the Python implementation may not be 100% feature parity at all levels.

Our Python implementation is not for production - it only serves as a _simple_ example for our exercise.

## Exploring the Python Code

The Python version of the Episodes Api lives in `./ex-10/got-episodes-api-python`

Steps:

- The Main routine (`./src/main.py`)
- Routes (`./src/routes/episodes.py`)
- The Controller (`./src/controller/episodes_controller.py`)
- The Model (`./src/data/models.py`)
- Core support (`./src/core/`)

--Now You--

- Examine the code

## Configuring the and preparing the Python API

Steps:

- Open a new terminal session and navigate to `./got-episodes-api-python`
- Install Python dependencies

    ```shell
    pip install -r requirements.txt 
    ```
- Execute tests

    ```shell
    TBA 
    ```
- In `./src/core/config.py` update the API audience to reflect your API (AppSettings)
    - Follow the pattern in the code for this; use only the GUID not the whole URI
    - Remember to save

--Now You--

- Do the steps above


## Swapping the API's (Executing)

This part assumes that you have the following set-up operational
- The NodeJS version of the Client is running in a terminal session
- The NodeJS version of the Episodes Api is running in terminal session
- The application (The Client) is working ok, episodes can be requested

- We assume you have a terminal session open at `./got-episodes-api-python`

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
    - Using the Client GUI and the "Show Got Episodes"
    - Exploring the api on PORT 3100 on path `/docs` 
- Explore the API differences by stopping the Python version and then starting the NodeJS version (back-and-forth)

## Discuss security issues and good practices

- How "close" does the api (NodeJS/Python) need to be, on a contract level?
- .

