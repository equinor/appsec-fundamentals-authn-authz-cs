<!-- markdownlint-disable MD034 MD024 -->

# Testing with Cypress

In this section we will explore testing with [Cypress](https://cypress.io). This will be a combination of integration and acceptance testing, everything running through a browser - seen from the end-user-perspective.

## Installing Cypress

Steps:

* Open a new terminal window and navigate to the `ex-14/client-cypress` folder
* Install our test project and Cypress by doing

  ```shell
  npm install
  ```

  While the install is running, browse the [Cypress getting started](https://on.cypress.io/installing-cypress) and look at [Writing Your First Test](https://docs.cypress.io/guides/getting-started/writing-your-first-test)

* Explore our Cypress set-up `ex-14/client-cypress/cypress`
  * `./fixtures/test-user.json` - fixtures used in tests
  * `./e2e/client-o365dev.cy.js` - this is our test
  * `plugins` - we don't use plugins in our project
  * `screenshots` - where screen shots will be stored (if activated)
  * `videos` - where videos of test runs will be stored (if activated)
  * `support` - where you would add supporting JS commands, common functions etc.
* Explore our test code in `cypress/integration/client-o365dev.spec.js`
* Start cypress by either doing

  ```shell
  npm run cypress:open
  ```

  or

  ```shell
  npx cypress open
  ```

* Select "E2E Testing"
* Cypress will start and then complain about not being able to connect base url (this is ok)
  * [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices#Setting-a-global-baseUrl) recommends setting a global base url.
  * The baseUrl will be the prefix to all **cy.visit()** command.
  * We have defined our baseUrl in ´./cypress.json´ to point to http://localhost:3000. This is where our app is running.
* Stop Cypress (for now)

### --Now You---

* Do the steps above

---

## Running our first Cypress Test

At this stage Cypress should be installed and ready for action. We will explore and run our test.

Steps:

* Start our web application using docker compose
  * In a new terminal window (assuming current dir is `./ex-14`)

    ```shell
    cd docker
    source ~/(path-to-env-files)/(prefix)-appsec-course-Docker-Compose-(pipeline).env 
    docker-compose up client episodes quotes
    ```

  * Open a browser and verify that our app is working
    * The login should be automatic - no prompts. If not fix the issue 👷
* Start Cypress
  * In a new terminal windows, navigate to `./ex-14/client-cypress`
  * Start Cypress

    ```shell
    npm run cypress:open
    ```

    or

    ```shell
    npx cypress open
    ```
* Select E2E testing
* Select "electron" and then "Start E2E Testing in Electron"
* Verify the `cypress/fixtures/test-user.json` fixture - it should reflect your test user.
* In Cypress
  * Run the integration test `client-o365dev`
* Explore the various steps in the test
* Open and explore the test code in your IDE
  * `./cypress/e2e/client-o365dev.cy.js`
* Do a change to your test code
  * For the first test which opens the client, change

    ```Javascript
     cy.contains('Game of Thrones Episodes')
    ```

    to

    ```Javascript
     cy.contains('Game of Thrones Episodes!')
    ```

  * Save
  * Observe that Cypress restart the testing and that the first test fails,
  * Explore the error
  * Fix the error, save and re-run test
* Close Cypress

### --Now You---

* Do the steps above

---

## Running headless

At this stage we have a test that is verifying that our application performs as expected, all from an end-user-perspective. We indirectly test all 3 components/service.

The next step will be to run the same tests headless, that is running the test in a browser without a graphical user interface (GUI)

Steps:

* **We are assuming our web app is running and working, if not start it as described above**
* We assume that you have a terminal windows open and that current folder is `./ex-14/client-cypress`
* Run test test in headless mode

  ```shell
  npm run cypress:run
  ```

* There will be no recording of the test. This feature needs to be enabled as part of the config. Explore `cypress.config.js`, enable, re-run tests and find video.

* Observe
  * The tests should execute successfully
  * A recording (video) will be available if you have enabled this feature.

### --Now You---

* Do the steps above

---

## Testing using Docker

Having the testing done in headless mode is nice. We now have most of our infrastructure running in containers - not Cypress. Time to move Cypress to Docker as well.

Luckily Cypress has quite a few standard Docker images that we can [use](https://docs.cypress.io/examples/examples/docker#Images).

Steps:

* Investigate `./ex-14/client-cypress/dtest.sh`
  * If you are using gitbash **directly** on Windows, and not as part of the **windows terminal**, gitbash will not work as a TTY. The -t parameter used in `./dtest.sh` must be removed.
* We need to add the environment variable **CLIENT_PORT** at which port to find the web app at local host, then we can execute Cypress using docker
* If on Linux, consult the [FAQ](../../Support/faq.md#hostdockerinternal) for how to substitute `host.docker.internal` for the `baseUrl` when running Cypress.
* Run tests in Docker

  ```shell
  export CLIENT_PORT=3000
  ./dtest.sh
  ```

### --Now You--

* Do the steps above

## --Discuss security issues and good practices--

* Using "best practices" recommendation from tools and frameworks is smart!
* Using "security advice" and understanding security risks imposed by tools and frameworks are very smart!
  * Cypress have a discussion on [Web Security](https://docs.cypress.io/guides/guides/web-security)
* Since version 12 Cypress support [multiple origins](https://docs.cypress.io/guides/references/changelog#12-0-0) and visits will automatically [follow redirects](https://docs.cypress.io/api/commands/visit#Visit-will-automatically-follow-redirects). This give new opportunities.