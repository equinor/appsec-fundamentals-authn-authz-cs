<!-- markdownlint-disable MD033 -->

# Preparations

Preparing the repository

WORK IN PROGRESS

---

## Copying the workshop repository

<div style="font-size:0.6em">

* Verify that you have access to the workshop repository on Github -<br/> [equinor/appsec-fundamentals-authn-authz-cs](https://github.com/equinor/appsec-fundamentals-authn-authz-cs)
* Create a copy of the repo by
  * Select "Use this template"
  * Organization: "Equinor-Playground"
  * Name: "(initials)-appsec-fundamentals-authn-authz-cs"
  * Add a description
  * Do not include all branches
  * Select "Create repository from template"
* Verify that you can access your new repository at the [Equinor-Playground](https://github.com/Equinor-Playground)


We recommend using ssh keys when working with git and github.com. If you use https you'll need to use Personal Access Tokens which replaces the password for the authentication. More information on these features in the github.com docs ([1](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls), [2](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/#what-you-need-to-do-today))

</div>

#### -- Now You --

---

## Verify repository settings

<div style="font-size:0.7em">

Review and discuss repository settings

* Visibility should be `internal`
  * Mainly due to the risk of exposing secrets while playing
* Options - Features
  * **Disable** Wikis, Issues, Projects and Discussions
  * "Allow forking" is disabled for private repos in the Equinor-Playground org.
* Verify access, create teams when giving access
  * Add yourself as an "admin" for the repository.
* Security & Analysis
* Branches:
  * Default branch is `main`
  * Briefly explore Branch protection rules
* Actions
  * Disable actions (Be cautious on which actions that are allowed later)
* Secrets:
  * We don't need secrets in our course, except for those which use CodeSpaces.

</div>
