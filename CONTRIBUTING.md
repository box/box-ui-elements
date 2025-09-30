# Contributing

All contributions are welcome to this project.

## Contributor License Agreement

Before a contribution can be merged into this project, please fill out the Contributor License Agreement (CLA) located at:

https://cla-assistant.io/box/box-ui-elements

To learn more about CLAs and why they are important to the UI Element projects, please see the [Wikipedia entry](http://en.wikipedia.org/wiki/Contributor_License_Agreement).

## Code of Conduct

This project adheres to the [Box Open Code of Conduct](http://opensource.box.com/code-of-conduct/). By participating, you are expected to uphold this code.

## How to contribute

_If you're a Box employee, you do not need to file an issue._

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

The message summary should be a one-sentence description of the change, and it must be 72 characters in length or shorter. For a list of tags, please [click here](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#type-enum). See the [default release rules](https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/index.js) based on the commit tag. Note that you must include the exact keyword "BREAKING CHANGE" for breaking changes, to learn more [click here](https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-conventionalcommits/parser-opts.js#L13). IMPORTANT: Add "BREAKING CHANGE" to your PR title as well, because when multiple commits are merged the PR title takes precedence as the merge commit message.

Shown below are examples of the release type that will be done based on a commit message.

#### Commit Types

"Semantic versioning" means that changes to the version number of the package (e.g. `3.42.11` to `3.43.0`) are done according to rules that indicate how the change will affect consumers. Read more on the [npm page](https://docs.npmjs.com/about-semantic-versioning).

The version number is broken into 3 positions &mdash; `Major.Minor.Patch`. In semantic release terms, changes to the numbers follow `Breaking.Feature.Fix`. The `semantic-release` script parses commit messages and decides what type of release to make based on the types of commits detected since the last release.

The rules for commit types are:

- Anything that changes or removes an API, option, or output format is a `BREAKING CHANGE`.
- Anything that adds new functionality in a backwards-compatible way is a feature (`feat`). Consumers have to upgrade to the new version to use the feature, but nothing will break if they do so.
- Bugfixes (`fix`) for existing behavior are a patch. Consumers don't have to do anything but upgrade.
  - Performance fixes (`perf`) and reverts (`revert`) are treated as patch releases.
  - Automated commits from Box's internalization team cause a patch because they will use the format `fix(moji): ***`.
- Other prefixes, such as `docs`, don't trigger releases and don't appear in the changelog. These tags signal that there are **no external changes to _any_ APIs** (including non-breaking ones).
  Changes from these types of commits will get released only when the release script detects other releasable commits (feat/fix) going out at the same time.
  - `build`, `ci`, `chore`, `docs`, `refactor`, `style`, `test`

In most cases, commits will be a `feat` or `fix`. Make sure to include the `BREAKING CHANGE` string in the summary if there are non-backwards-compatible changes in the commit.

| Commit message                                                                                                                                          | Release type       | New version |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- |
| `feat(preview): remove fullscreen ability`<br><br>`BREAKING CHANGE: The fullscreen ability has been removed due to poor support of the fullscreen api.` | Major ("breaking") | `X+1.0.0`   |
| `feat(preview): add ability to fullscreen`                                                                                                              | Minor ("feature")  | `X.Y+1.0`   |
| `fix(preview): fullscreen behavior in ie11`                                                                                                             | Patch ("fix")      | `X.Y.Z+1`   |
| `docs(preview): document fullscreen api`                                                                                                                | No release         | `X.Y.Z`     |
| `chore(preview): remove commented code from preview`                                                                                                    | No release         | `X.Y.Z`     |
| `refactor(preview): rename a variable (invisible change)`                                                                                               | No release         | `X.Y.Z`     |

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

### Step 8: Add `ready-to-merge` label

After your pull request has been approved and the check statuses are green, please add the `ready-to-merge` label instead of using the merge button. This will add your pull request to the merge queue and merge your pull request when it is safe. If you are unable to add the `ready-to-merge` label, please ask an approver or maintainer for assistance
