# Contributing

All contributions are welcome to this project.

## Contributor License Agreement

Before a contribution can be merged into this project, please fill out the Contributor License Agreement (CLA) located at:

https://developer.box.com/v2.0/docs/box-ui-elements-cla

To learn more about CLAs and why they are important to the UI Element projects, please see the [Wikipedia entry](http://en.wikipedia.org/wiki/Contributor_License_Agreement).

## Code of Conduct

This project adheres to the [Box Open Code of Conduct](http://opensource.box.com/code-of-conduct/). By participating, you are expected to uphold this code.

## How to contribute

* See [Developing Guide](Developing.md).
* **File an issue** - if you found a bug, want to request an enhancement, or want to implement something (bug fix or feature).
* **Send a pull request** - if you want to contribute code. Please be sure to file an issue first.

## Pull request best practices

We want to accept your pull requests. Please follow these steps:

### Step 1: File an issue

Before writing any code, please file an issue stating the problem you want to solve or the feature you want to implement. This allows us to give you feedback before you spend any time writing code. There may be a known limitation that can't be addressed, or a bug that has already been fixed in a different way. The issue allows us to communicate and figure out if it's worth your time to write a bunch of code for the project.

### Step 2: Fork this repository in GitHub

This will create your own copy of our repository.

### Step 3: Add the upstream source

The upstream source is the project under the Box organization on GitHub. To add an upstream source for this project, type:

```
git remote add upstream git@github.com:box/box-ui-elements.git
```

This will come in useful later.

### Step 4: Create a feature branch

Create a branch with a descriptive name, such as `add-search`.

### Step 5: Push your feature branch to your fork

As you develop code, continue to push code to your remote feature branch. Please make sure to include the issue number you're addressing in your commit message, such as:

```
Tag: Short description (fixes #1234)

Longer description here if necessary
```
The Tag is one of the following:

* `Fix` - for a bug fix.
* `Update` - for a backwards-compatible enhancement or a change to a rule that increases the number of reported problems.
* `New` - implemented a new feature.
* `Breaking` - for a backwards-incompatible enhancement or feature.
* `Docs` - changes to documentation only.
* `Build` - changes to build process only.
* `Upgrade` - for a dependency upgrade.
* `Chore` - for refactoring, adding tests, etc. (anything that isn’t user-facing).

The message summary should be a one-sentence description of the change, and it must be 72 characters in length or shorter. If the pull request addresses an issue, then the issue number should be mentioned at the end.

Keep a separate feature branch for each issue you want to address.

### Step 6: Rebase

Before sending a pull request, rebase against upstream, such as:

```
git fetch upstream
git rebase upstream/master
```

This will add your changes on top of what's already in upstream, minimizing merge issues.

### Step 7: Run the tests

Make sure that all tests are passing before submitting a pull request.

### Step 8: Send the pull request

Send the pull request from your feature branch to us. Be sure to include a description (as mentioned above in step 5) that lets us know what work you did.

Keep in mind that we like to see one issue addressed per pull request, as this helps keep our git history clean and we can more easily track down issues.
