# Development Setup

Our development setup assumes a LINUX/BSD environemnt.

## Project Setup

1. Install Node v10.0.0 or higher.
2. Install Yarn package manager `https://yarnpkg.com/en/docs/install` v1.10 or higher.
3. Fork the upstream repo `https://github.com/box/box-ui-elements` via github.
4. Clone your fork locally `git clone git@github.com:[YOUR GITHUB USERNAME]/box-ui-elements.git`.
5. Navigate to the cloned folder `cd box-ui-elements`.
6. Add the upstream repo to your remotes `git remote add upstream git@github.com:box/box-ui-elements.git`.
7. Verify your remotes are properly set up `git remote -v`. You should pull updates from the `upstream` box repo and push changes to your fork `origin`.

## Testing UI Elements with demo data

Examples can be found in the [examples folder](examples). These examples use demo data within the UI Elements. Due to security restrictions, the data is read-only.

1. Start the examples/styleguide server via `yarn start`.
2. Navigate to `http://localhost:6060/` to see the UI Elements in action.

## Testing UI Elements with your data

To test the Box UI Elements with your own box data and auth token, launch a local webpack dev server via `yarn start:dev` and navigate to `http://localhost:8080/`. HTML test files for local development are located inside the [test folder](http://localhost:8080/test).

1. Open a test file, such as http://localhost:8080/test/sidebar.html
2. When prompted, enter a file id and developer token.
    1. Developer tokens can be created at https://app.box.com/developers/console.
    2. Select `Custom App` and choose `Oauth 2.0 with JWT (Server Authentication)`.
    3. Select `View Your App` > `Configuration` > `CORS Domains` and add `http://localhost:8080` to the domain whitelist. Save the configuration.
    4. The developer token will be regenerated once the configuration is saved. Copy the token and paste into the prompt in the localhost test page. The token will be valid for an hour; return to the app configuration page to generate a new token.
    5. For additional information about developing on the Box Platform, see the [Platform docs](https://developer.box.com/docs/box-ui-elements#section-using-the-box-ui-elements).

## Testing UI Elements in a parent project

To test the Box UI Elements with your own project use local Yarn linking.

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

-   `yarn start` to launch a local styleguide examples server. Uses demo live data for Elements.
-   `yarn start:npm` to symlink Elements via `yarn link` to a parent project.
-   `yarn start:dev` to launch a local webpack dev server. Uses your own data for Elements.
-   `yarn lint` to lint js and css.
-   `yarn lint:js --fix` to lint js and fix issues.
-   `yarn lint:css --fix` to lint styles and fix issues.
-   `yarn test` to launch tests with jest.
-   `yarn test --watch` to launch tests with jest in watch mode.
-   `yarn test --coverage` to launch tests with jest with coverage.
-   `yarn release` to run a release.

For more script commands see `package.json`. Test coverage reports are available under reports/coverage.

## Testing

For test debugging follow instructions provided in the [jest documentation](https://facebook.github.io/jest/docs/en/troubleshooting.html).
