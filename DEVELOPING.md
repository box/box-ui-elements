Development Setup
-----------------

Our development setup assumes a LINUX/BSD environemnt. Windows users may have to use cygwin.

1. Install Node v6.10.0 or higher.
2. Install yarn package manager `https://yarnpkg.com/en/docs/install` v1.0.1 or higher. Alternatively, you can replace most `yarn` commands with `npm` commands.
2. Fork the upstream repo `https://github.com/box/box-ui-elements`.
3. Clone your fork locally `git clone git@github.com:[YOUR GITHUB USERNAME]/box-ui-elements.git`.
4. Navigate to the cloned folder `cd box-ui-elements`
5. Add the upstream repo to your remotes `git remote add upstream git@github.com:box/box-ui-elements.git`.
6. Verify your remotes are properly set up `git remote -v`. You should pull updates from the Box repo `upstream` and push changes to your fork `origin`.
7. Install dependencies `yarn install`
8. Test your first build! `yarn run build`
9. To test the Box UI Elements launch a local webpack dev server via `yarn run dev` and navigate to `http://localhost:8080/`. HTML files for local development are located inside the [`test` folder](http://localhost:8080/test).
  - Open a test file, such as http://localhost:8080/test/sidebar.html
  - When prompted, enter a file id and developer token.
    - Developer tokens can be created at https://cloud.app.box.com/developers/console
    - Select "Custom App" and choose "Oauth 2.0 with JWT (Server Authentication)". Select "View Your App" > "Configuration" > "CORS Domains" and add `http://localhost,http:localhost:8080` to the domain whitelist. Save the configuration.
    - The developer token will be regenerated once the configuration is saved. Copy the token and paste into the prompt in the localhost test page. The token will be valid for an hour; return to the app configuration page to generate a new token.
    - For additional information about developing on the Box Platform, see the [Platform docs](https://developer.box.com/docs/box-ui-elements#section-using-the-box-ui-elements).

While Developing
----------------
Install the following plugins in your preferred editor

* Editor Config (standardizes basic editor configuration)
* ESLint (Javascript linting)
* Stylelint (CSS linting)
* Prettier (Javscript formatting)
* Sass (Stylesheets)
* Babel (Transpiler)

### Yarn commands

* `yarn run build` to run webpack and generate JS/CSS.
* `yarn run dev` to launch a local webpack dev server and watch file changes.
* `yarn run prettier` to format JS code with prettier.
* `yarn run test` to launch tests with jest.
* `yarn run test --coverage` to launch tests with jest with coverage.

For more script commands see `package.json`. Test coverage reports are available under reports/coverage.

For test debugging follow instructions provided in the [jest documentation](https://facebook.github.io/jest/docs/en/troubleshooting.html).

### Config files

* .editorconfig - http://editorconfig.org/
* .eslintignore - http://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories
* .eslintrc.js - http://eslint.org/docs/user-guide/configuring
* .gitignore - https://git-scm.com/docs/gitignore
* .stylelintrc - https://stylelint.io/user-guide/configuration/
* .travis.yml - https://docs.travis-ci.com/user/customizing-the-build
* babel.config.js - https://babeljs.io/docs/en/config-files/
* browserslist - https://github.com/ai/browserslist
* postcss.config.js - https://github.com/postcss/postcss-loader
