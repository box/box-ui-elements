# Development Setup

Our development setup assumes a LINUX/BSD environemnt. Windows users may have to use cygwin.

1. Install Node v8.10.0 or higher.
2. Install yarn package manager `https://yarnpkg.com/en/docs/install` v1.12 or higher.
3. Fork the upstream repo `https://github.com/box/box-ui-elements`.
4. Clone your fork locally `git clone git@github.com:[YOUR GITHUB USERNAME]/box-ui-elements.git`.
5. Navigate to the cloned folder `cd box-ui-elements`.
6. Add the upstream repo to your remotes `git remote add upstream git@github.com:box/box-ui-elements.git`.
7. Verify your remotes are properly set up `git remote -v`. You should pull updates from the box repo `upstream` and push changes to your fork `origin`.
8. Finally start the examples/styleguide server `yarn start`.
9. Navigate to `http://localhost:6060/` to see the UI Elements in action.

## Testing UI Elements with your data

To test the Box UI Elements with your own box data and auth token, launch a local webpack dev server via `yarn start:dev` and navigate to `http://localhost:8080/`. HTML test files for local development are located inside the [`test` folder](http://localhost:8080/test).

1. Open a test file, such as http://localhost:8080/test/sidebar.html
2. When prompted, enter a file id and developer token.
    1. Developer tokens can be created at https://app.box.com/developers/console.
    2. Select `Custom App` and choose `Oauth 2.0 with JWT (Server Authentication)`. Select `View Your App` > `Configuration` > `CORS Domains` and add `http://localhost:8080` to the domain whitelist. Save the configuration.
    3. The developer token will be regenerated once the configuration is saved. Copy the token and paste into the prompt in the localhost test page. The token will be valid for an hour; return to the app configuration page to generate a new token.
    4. For additional information about developing on the Box Platform, see the [Platform docs](https://developer.box.com/docs/box-ui-elements#section-using-the-box-ui-elements).

## Testing UI in a parent project

To test the Box UI Elements with your own project use yarn linking.

1. In the UI Elements project run `yarn link` as a one time setup.
2. In UI Elements project run `yarn start:npm` which starts a local npm build in watch mode.
3. In your parent project run `yarn link box-ui-elements` every time you plan to use the local linked version.
4. Run your parent project's build.

## While Developing

Install the following plugins in your preferred editor

-   Editor Config (standardizes basic editor configuration)
-   ESLint (Javascript linting)
-   Stylelint (CSS linting)
-   Prettier (Javscript formatting)
-   Sass (Stylesheets)
-   Babel (Transpiler)

## Common script commands

-   `yarn start` to launch a local styleguide examples server.
-   `yarn start:dev` to launch a local webpack server.
-   `yarn start:npm` to symlink via yarn link to a parent project.
-   `yarn lint` to lint js and css.
-   `yarn lint --fix` to lint js and fix issues.
-   `yarn test` to launch tests with jest.
-   `yarn test --watch` to launch tests with jest in watch mode.
-   `yarn test --coverage` to launch tests with jest with coverage.

For more script commands see `package.json`. Test coverage reports are available under reports/coverage.

## Testing

For test debugging follow instructions provided in the [jest documentation](https://facebook.github.io/jest/docs/en/troubleshooting.html).

## Publishing

**_Note: For Box employees only_**

This project is published on public [npmjs](https://www.npmjs.com/package/box-ui-elements). Before doing a release, make sure you have `GITHUB_TOKEN` environment variable set on your machine.

1. Generate a token from [here](https://github.com/settings/tokens/new), with `repo` scope selected.
2. Add `export GITHUB_TOKEN="<your-token>"` in your `~/.bash_profile` (or `~/.bashrc`).
3. Make sure the token is set in your current terminal window.

Releases are done from the `release` branch. To push a new release use `yarn release`. Doing so will reset the `release` branch to match the latest `master` branch and thereafter run a release. If you want to do a hotfix on a prior release, instead use `yarn release:hotfix` which will skip resetting to the `master` branch. When doing a hotfix release, it is assumed some hotfix is cherry picked to the release branch locally prior to running the release. Essentially, for a hotfix you want to:

1. git checkout release (or -b release) locally.
2. git reset --hard upstream/release
3. Merge/cherry-pick your hotfix and commit locally.
4. yarn release:hotfix
