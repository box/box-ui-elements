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
9. To test the Box UI Elements lauch a local webpack dev server via `yarn run deploy` and navigate to `http://localhost:8080/`. Sample test files are located inside the test folder.

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
* `yarn run watch` to run webpack and generate JS/CSS on file changes.
* `yarn run deploy` launches a local webpack dev server for testing. Also watches file changes.
* `yarn run prettier` to format JS code with prettier.
* `yarn run test` launches tests with jest.
* `yarn run test --coverage` launches tests with jest with coverage.

For more script commands see `package.json`. Test coverage reports are available under reports/coverage.

For test debugging follow instructions provided in the [jest documentation](https://facebook.github.io/jest/docs/en/troubleshooting.html).

### Config files

* .babelrc - https://babeljs.io/docs/usage/babelrc/
* .conventional-changelog-lintrc - https://github.com/marionebl/conventional-changelog-lint
* .editorconfig - http://editorconfig.org/
* .eslintignore - http://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories
* .eslintrc - http://eslint.org/docs/user-guide/configuring
* .gitignore - https://git-scm.com/docs/gitignore
* .stylelintrc - https://stylelint.io/user-guide/configuration/
* .travis.yml - https://docs.travis-ci.com/user/customizing-the-build
* browserslist - https://github.com/ai/browserslist
* postcss.config.js - https://github.com/postcss/postcss-loader
