<!-- markdownlint-disable MD024 -->

# A discussion on testing

In this section we will discuss some important elements on testing, software testing that is.

> We take responsibility for the correctness of our code by testing it thoroughly. We do not tolerate preventable defects.​

(From the 8th Light principles of Software Craftsmanship, [clean coder blog](https://blog.cleancoder.com/uncle-bob/2013/02/10/ThePrinciplesOfCraftsmanship.html))

## What is software testing?

The text book response would be something like:

> Software testing is the process of evaluating and verifying that a software product or application does what it is supposed to do. The benefits of testing include preventing bugs, reducing development costs and improving performance

Traditionally we have defines many forms of software testing. Some would be:

* Acceptance testing: Verifying whether the whole system works as intended (end-to-end testing)
* Integration testing: Ensuring that software components or functions operate together.
* Unit testing: Validating that each software unit performs as expected. A unit is the smallest testable component of an application.
* Functional testing: Checking functions by emulating business scenarios, based on functional requirements.
* Performance testing: Testing how the software performs under different workloads.
* Regression testing: Checking whether new features break or degrade functionality.
* Stress testing: Testing how much strain the system can take before it fails. Considered to be a type of non-functional testing.
* Usability testing: Validating how well a customer can use a system or web application to complete a task.
* Compatibility testing
* Smoke and sanity testing
* Alpha and beta testing
* Continuous testing
* Accessibility testing
* Security testing
* A/B testing
  
> Software testing is a craft that requires skills, proficiency and passion

## Agile testing

Traditionally (way back) most testing of software was organized as a separate activity using a waterfall approach. This approach did not work well, it still does not work well (in most cases). A good alternative can be **Agile Testing**. Lisa Crispin and Janet Gregory have written some really remarkable books on this topic ([Agile Testing](https://agiletester.ca/))

A few questions all teams should ask could be;

* what kind of testing should we do?
* where should we spend our "test money"?

Lisa and Janet adopted an agile test matrix initially proposed by Brian Marick and names this **Agile Testing Quadrant**.

![The Agile Testing Quadrant](../../doc/content/images/Agile-Testing-Quadrants.png)

This is a valuable tool enabling software development teams to have an informed discussion on testing in their context.

Many teams start in Q1 and get stuck there. **Spending all your "money" on one horse, or in one quadrant is rarely a robust strategy**

A few reflections on teams and testing:

* Testing in a primary skill on the same level as a software developer
* Testers work as an integrated part of software development team
* All Software development teams should have testers
* Good testers are also good coders
  * Test automation is hugely important (but should not be the only tool)
* Most programmers are not good testers?
* Asking questions like "How do we test this" will have a huge impact on software architecture and should be one of the first questions to ask in any discussion related to requirements, features, scope etc.
* Continuous testing is key

## Important principles

In the continuance of this workshop we will look at unit test, integration- and acceptance-testing. For this we want to explore some principles:

* Testing is context dependent - rarely a right or wrong answer
* We automate as much as possible of our testing
* We strive for a good balance between unit and integration/acceptance testing
* Testability of our code is crucial.
  * Asking "How to test this" should be the most important question to ask.
* Using design principles like [SOLID](https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html) will lead to higher testability of code
* The running code should not known that it's under test
* Our tests should not involve components that we don't control/own
* Don't test in production?

A few clarifications:

* Unit testing is typically testing from the "inside" using mocks/stubs
* Integration test are typically testing from the "outside"
* Acceptance (end-2-end) typically involved test from the "outside" from an end-user perspective
