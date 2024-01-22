# Swapping from Node to .Net on the Quotes API

In this part we change the technology used on the Quotes API from NodeJS to .Net. The purpose is to explore how _easy_ it is to include technologies as long as the contract is the same. We also want to make a simple .Net example available. The functionality between the NodeJS implementation and the .Net implementation may not be 100% feature parity at all levels.

At the end we the application will consist of 3 technologies working together in _harmony_, NodeJS, Python and .Net.

Our .Net implementation is not for production - it only serves as a _simple_ example for our exercise.

## Exploring the .Net Code (🥸)

The .Net version of the Episodes Api lives in `./ex-11/got-quote-api-dotnet`

Steps:

- The .Net Project (`./src/got-quote-api-dotnet.csproj`)
- Routes (`./src/routes/Routes.cs`)
- The Controller (`./src/controller/QuoteController.cs`)
- The Model (`./src/models/Quote.cs`)
- Utils (`./src/utils/TokenValidator.cs`)
- Middleware (`./src/middleware/JwtMiddleware.cs`)
- Config (`./src/appsettings.json`)
- Tests (`./src/tests`)

--Now You--

- Examine the code


## Configuring the and preparing the .Net API

Steps:

- Assuming you  have a terminal session in `./ex-11/got-quote-api-dotnet`
- Build the project

    ```shell
    dotnet build 
    ```
- Execute tests

    ```shell
    dotnet test 
    ```
--Now You--

- Do the steps above


## Swapping the API's (Executing)

This part assumes that you have the following set-up operational
- The NodeJS version of the Client is running in a terminal session
- The Python version of the Episodes Api is running in terminal session
- The NodeJS version of the Quotes Api is running in terminal session
- The application (The Client) is working ok, Episodes with Quotes can be requested as usual

- We assume you have a terminal session open at `./ex-11/got-episodes-api-dotnet`

Steps:

- Stop the NodeJS Quotes API
- Source your configuration file

    ```shell
    source ~/path-to-env-file/appsec-course-api-quotes-eq.env 
    ```
- Start the .Net Api

    ```shell
    cd ./src
    dotnet run
    ```

--Now You--

- Do the steps above
- Test the API by
    - Using the Client GUI and the "Show Got Episodes", verify that Quotes are served from the .Net Quotes Api
    - (__Optional__) Exploring the swagger api on PORT 3200 `/swagger` (and notice that such interfaces may not be on the same endpoint for all systems)
- Explore interchanging the api's (Episodes, Quotes)
    - The config should be the same for all
- Explore the swagger end-point for the .Net api
