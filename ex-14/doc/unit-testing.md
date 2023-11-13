<!-- markdownlint-disable MD024 -->

# Unit testing

In this section we will briefly explore and discuss unit testing in context of our system.

## The Client

Steps:

* Open a terminal window an navigate to "./ex-14/client"
* Install dependencies

  ```shell
  npm install
  ```

* Execute Unit Tests

  ```shell
  npm test
  ```

* (Not done in workshop) Execute a Security Test (OS Vulnerability testing)

  ```shell
  npm run snyk
  ```  

* Execute another Security Test (Static code analysis)
  
  ```shell
  npm run lint
  ```

* Execute Unit Tests with coverage report

  ```shell
  npm run test-cover
  ```

* Briefly explore test code
  * ./test/app-config.test.js
  * ./test/auth-utils.test.js
* Briefly explore
  * Impact of using frameworks on Mocks & Stubs
    * "got" vs. "msal" - complexity of objects, request, response

### --Now You--

* Do the steps above

### --Discuss security issues and good practices--

* Share experiences on unit testing
* The "app-config" utility is 150 lines of code, the test routine is 200+. Test coverage is around 75%.
  * Is it a problem that that the test code usually is a lot bigger than the code we test?
  * Test code is also code that needs to be maintained?
* Discuss on how we are according to the [principles](testing.md)?

## The Episodes API

Both the Episodes API and The Quotes API are built using the same template. We only need to look at one.

Steps:

* Open a terminal window an navigate to "./ex-14/got-episodes-api"
* Install dependencies

  ```shell
  npm install
  ```

* Execute Unit Tests

  ```shell
  npm test
  ```

* (Not done in workshop) Execute a Security Test (OS Vulnerability testing)

  ```shell
  npm run snyk
  ```  

* Execute another Security Test (Static code analysis)

  ```shell
  npm run lint
  ```

* Execute Unit Tests with coverage report

  ```shell
  npm run test-cover
  ```

* Briefly explore test code
  * ./test/auth.test.js

### --Now You--

* Do the steps above
* Discuss/observe the low test coverage of `auth.js`. It's around 40% - but that may be ok if spend more _test money_ on the integration part, testing from the outside?
