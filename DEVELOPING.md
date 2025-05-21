# Development Setup

Our development setup assumes a LINUX/BSD environment.

## Project Setup

1. Install Node v18.
2. Install Yarn package manager `https://yarnpkg.com/en/docs/install` v1.10 or higher.
3. Fork the upstream repo `https://github.com/box/box-ui-elements` via github.
4. Clone your fork locally `git clone git@github.com:[YOUR GITHUB USERNAME]/box-ui-elements.git`.
5. Navigate to the cloned folder `cd box-ui-elements`.
6. Add the upstream repo to your remotes `git remote add upstream git@github.com:box/box-ui-elements.git`.
7. Verify your remotes are properly set up `git remote -v`. You should pull updates from the `upstream` box repo and push changes to your fork `origin`.

## Storybook

We use Storybook (https://storybook.js.org/). A published version of our Storybook is available at https://opensource.box.com/box-ui-elements/.

## Local development

1. Start your local Storybook instance via `yarn start`.
2. Navigate to `http://localhost:6061/` to see the UI Elements in action. If testing on a different machine or VM, you can instead use the IP address shown on your terminal window.

## Testing UI Elements in a Parent Project

### Webpack Setup

`box-ui-elements` must use the same `react` and `react-dom` instances as the parent application for React hooks to work properly. Application repositories must add the following webpack `resolve` alias configuration to satisfy this requirement:

```js
// webpack.config.js
{
    ...
    resolve: {
        alias: {
            'react': path.resolve('node_modules/react'),
            'react-dom': path.resolve('node_modules/react-dom'),
        }
    }
    ...
}
```

This will ensure that `box-ui-elements` does not use its own `react` and `react-dom` modules when linked. Improper setup is the primary reason for "**Invalid Hook**" errors due to React version mismatch.

We also recommend using `yarn resolutions` to fix the version of `react` and `react-dom` in your application:

```js
// package.json
{
    ...
    "resolutions": {
        "react": "17.0.1",
        "react-dom": "17.0.1"
    },
    ...
}
```

### Linking `box-ui-elements`

To test the Box UI Elements with your own project use local Yarn linking.

1. In the UI Elements project run `yarn link` as a one time setup.
2. In UI Elements project run `yarn start:npm` which starts a local npm build in watch mode.
3. In your parent project run `yarn link box-ui-elements` every time you plan to use the local linked version.
4. Run your parent project's build.

## Common Script Commands

- `yarn start` to launch a local Storybook server. Uses demo live data for Elements.
- `yarn start:npm` to symlink Elements via `yarn link` to a parent project.
- `yarn start:dev` to launch a local webpack dev server. Uses your own data for Elements.
- `yarn lint` to lint js and css.
- `yarn lint:js --fix` to lint js and fix issues.
- `yarn lint:css --fix` to lint styles and fix issues.
- `yarn test` to launch tests with jest.
- `yarn test --watch` to launch tests with jest in watch mode.
- `yarn test --coverage` to launch tests with jest with coverage.
- `yarn release` to run a release.

For more script commands see `package.json`. Test coverage reports are available under reports/coverage.

## Best Practices

### `import * as React from 'react'`

You should always use this syntax over `import React, { ... } from 'react'` because it automatically includes flow types.

Consequently, you must use the `React` prefix for related functions and components.

- ~~`Component`~~ => `React.Component`
- ~~`useState`~~ => `React.useState`

For more information, please see https://flow.org/en/docs/react/components/#toc-class-components

## Useful Plugins

Install the following plugins in your preferred editor

- Editor Config (standardizes basic editor configuration)
- ESLint (JavaScript linting)
- Stylelint (CSS linting)
- Prettier (JavaScript formatting)
- Sass (Stylesheets)
- Babel (Transpiler)

## Unit Testing

### `jest` and `enzyme`

The project uses the `jest` testing framework and `enzyme` for component testing.

Please refer to the relevant documentation pages for tutorials and troubleshooting:

- Jest: https://jestjs.io
- Enzyme: https://airbnb.io/enzyme/

### Testing Hooks with `enzyme`

Most hooks can be tested with `shallow` rendering except for lifecycle hooks such as `useEffect` and `useLayoutEffect`.

To test a `useEffect` hook, you must use `act()` from `react-dom/test-utils` and `mount()` from `enzyme`.

```jsx
import { act } from 'react';

test('something happens', () => {
    let wrapper;

    // Perform initial render
    act(() => {
        wrapper = mount(<SomeComponent foo="bar">Content</SomeComponent>);
    });

    // Assert
    expect(wrapper...);

    // Perform re-render
    act(() => {
        // Update props to exercise lifecycle methods
        wrapper.setProps({
            foo: 'baz'
        });
    });

    // Update wrapper - This must be after act()
    wrapper.update();

    // Assert
    expect(wrapper...);
})
```

See [React Testing Recipes](https://reactjs.org/docs/testing-recipes.html) for more examples.

## Troubleshooting

### Python

```
gyp verb check python checking for Python executable "/usr/bin/python" in the PATH
gyp verb `which` failed Error: not found: /usr/bin/python
```

1. Ensure you have Python 2 installed
2. Get the location of your Python installation via `which python`
3. `yarn config set python /path/to/python`
