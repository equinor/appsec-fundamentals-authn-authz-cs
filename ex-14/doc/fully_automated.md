<!-- markdownlint-disable MD034 MD024 -->

# Bringing it all together

In this section we will explore a fully automated integration/acceptance-test run using Docker-Compose.

Steps:

* Ensure that all running instances of the web app is stopped
* Current directory should be `./ex-14/docker`
* Explore the Cypress service of `./docker-compose.yml`
  * The `depends_on` will amongst other not start cypress before other services are available
  * We have turned off creating video recordings
  * We have added proxy set-up to enable using behind corp firewall
  * The services uses a standard Cypress Image
  * Tests etc are defined in our 'Cypress-Client' directory which is mounted in as a volume
* Explore the `./test.sh` script
  * `docker-compose up` will start everything, the run will be shutdown when Cypress is finished. The exit code from Cypress will be exposed.
* Run the fully automated test scenario (assuming a open terminal window, current dir `./ex-14/docker`)

  ```shell
    source ~/(path-to-env-files)/(prefix)-appsec-course-Docker-Compose-(pipeline).env 
    ./test.sh
   ```

## --Now You--

* Do the steps above

## --Discuss security issues and good practices--

* We now have a fully automation scenario running. This could easily be executed in any CI environment, like Github Actions.
* We have
  * moved more effort from unit testing to integration/acceptance testing
  * a fully automated scenario
  * good support for continuos testing
  * a fully synthetic test environment
  * not turned off A&A
  * the opportunity to create any scenario of users, groups etc and test from end-user perspective.
  * an opportunity to invite end-users to contribute to write tests? (tests which become part of our regression suite)
* We have broken a few principles for too reach this state - which is ok?
* We have a pretty complex set-up (micro services patten)
  * Many moving component
  * A dynamic setup with a lot of config parameters, AD registrations etc.
  * For a "real-life" set-up everything should be scripted - like creating AD object
  * Secrets stores (like KeyVault) should be used to hold config
  * Routines needs to be developed to rotate secrets
* Discuss the favorable and the unfavorable factors or reasons; advantages and disadvantages of our pattern
  * Pros
  * Cons

## Cleaning-up

We have scripted all the AAD work. All the config is code and we can treat the config as immutable. Let's clean-up, it only take seconds to re-establish a known state.

* Stop all containers (`docker-compose down`)
* Execute `./tear-down-project.sh` from the `./src` dir.
* (Observe that AAD objects and that .env files are gone)

### --Now You--

* Do the steps above
