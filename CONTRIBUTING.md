# Contributing

All contributions are welcome to this project.

## Contributor License Agreement

Before a contribution can be merged into this project, please fill out the Contributor License Agreement (CLA) located at:

https://developer.box.com/docs/box-sdk-cla

To learn more about CLAs and why they are important to the UI Element projects, please see the [Wikipedia entry](http://en.wikipedia.org/wiki/Contributor_License_Agreement).

## Code of Conduct

This project adheres to the [Box Open Code of Conduct](http://opensource.box.com/code-of-conduct/). By participating, you are expected to uphold this code.

## How to contribute

- **File an issue** - if you found a bug, want to request an enhancement, or want to implement something (bug fix or feature).
- **Make changes** - See the [developing guide](DEVELOPING.md).
- **Send a pull request** - if you want to contribute code. Please be sure to file an issue first.

## Pull request best practices

We want to accept your pull requests. Please follow these steps:

### Step 1: File an issue

Before writing any code, please file an issue stating the problem you want to solve or the feature you want to implement. This allows us to give you feedback before you spend any time writing code. There may be a known limitation that can't be addressed, or a bug that has already been fixed in a different way. The issue allows us to communicate and figure out if it's worth your time to write a bunch of code for the project.

### Step 2: Follow instructions to setup your environment

The [developing guide](DEVELOPING.md) has details on how to setup and test this project.

### Step 3: Create a feature branch

Create a branch with a descriptive name, such as `add-search`.

### Step 4: Push your feature branch to your fork

We use [semantic-release](https://github.com/semantic-release/semantic-release#commit-message-format) and the [conventional commit message format](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional). Keep a separate feature branch for each issue you want to address. As you develop code, continue to push code to your remote feature branch. If applicable, please make sure to include the issue number you're addressing in your commit message, such as:

```
tag(optional scope): short description

fixes #1234
longer description here if necessary.
include BREAKING CHANGE keyword for breaking changes.
```

The message summary should be a one-sentence description of the change, and it must be 72 characters in length or shorter. For a list of tags, please [click here](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#type-enum). We use the angular style for tags. See the [default release rules](https://github.com/semantic-release/commit-analyzer/blob/master/lib/default-release-rules.js) based on the commit tag. Shown below is an example of the release type that will be done based on a commit message.

| Commit message                                                                                                                                          | Release type               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `fix(preview): fullscreen behavior in ie11`                                                                                                             | Patch Release              |
| `feat(preview): add ability to fullscreen`                                                                                                              | ~~Minor~~ Feature Release  |
| `feat(preview): remove fullscreen ability`<br><br>`BREAKING CHANGE: The fullscreen ability has been removed due to poor support of the fullscreen api.` | ~~Major~~ Breaking Release |

### Step 5: Rebase

Before sending a pull request, rebase against upstream, such as:

```
git fetch upstream
git rebase upstream/master
```

This will add your changes on top of what's already in upstream, minimizing merge issues.

### Step 6: Run the tests

Make sure that all tests are passing before submitting a pull request. See the [developing guide](DEVELOPING.md).

### Step 7: Send the pull request

Send the pull request from your feature branch to us. Be sure to include a description (as mentioned above in step 4) that lets us know what work you did.

Keep in mind that we like to see one issue addressed per pull request, as this helps keep our git history clean and we can more easily track down issues.
