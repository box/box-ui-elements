[![Project Status](https://img.shields.io/badge/status-active-brightgreen.svg)](http://opensource.box.com/badges)
[![build status](https://travis-ci.com/box/box-ui-elements.svg?branch=master)](https://travis-ci.com/box/box-ui-elements)
[![Styled With Prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm version](https://img.shields.io/npm/v/box-ui-elements.svg)](https://www.npmjs.com/package/box-ui-elements)


[Box UI Elements](https://developer.box.com/docs/box-ui-elements)
==========================================================================
Box UI Elements are pre-built UI components that allow developers to add features of the main Box web application into their own applications. They can be used to navigate through, upload, preview, and select content stored on Box and are available both as React components and framework-agnostic JavaScript libraries.

# [Demo](https://opensource.box.com/box-ui-elements/)
*Please note that the demo page has limited functionality.*

## Installation
`yarn add box-ui-elements` or `npm install box-ui-elements`

To prevent library duplication, the UI Elements require certain peer dependencies to be installed manually. For a list of required peer dependencies, see [package.json](package.json).

# Usage
This documentation describes how to use UI Elements in a [React](https://facebook.github.io/react) application. If instead you require a framework-agnostic solution, please refer to our [developer documentation](https://developer.box.com/docs/box-ui-elements). You can also reference our [Elements Demo App](https://github.com/box/box-ui-elements-demo) and [Preview Demo App](https://github.com/box/box-content-preview-demo) for examples of minimal React applications using ContentExplorer and ContentPreview, respectively.

### Common
* [Authentication](src/elements/README.md#authentication)
* [Internationalization (i18n)](src/elements/README.md#internationalization)

### Elements
* [ContentExplorer](src/elements/content-explorer)
* [ContentOpenWith](src/elements/content-open-with)
* [ContentPicker](src/elements/content-picker)
* [ContentPreview](src/elements/content-preview)*
* [ContentSidebar](src/elements/content-sidebar)*
* [ContentUploader](src/elements/content-uploader)

\* _These components utilize code splitting. See the [Code Splitting](#code-splitting) section for more information._

### Code Splitting
[Code splitting](https://webpack.js.org/guides/code-splitting/) is currently supported for some UI Elements. In order to use an Element with code splitting, you will need to build the Element with webpack by importing it from the `es` folder in our npm package.

### Stylesheets
Each Box UI Elements requires its corresponding stylesheet to render properly. To import these stylesheets as modules (e.g. `import 'box-ui-elements/dist/sidebar.css';`), your project must integrate with Webpack's style-loader and css-loader. Alternatively, you can include the stylesheets in your application's HTML via `<style>` tags.

### Browser Support
* Desktop Chrome, Firefox, Safari, Edge (latest 2 versions)
* Limited support for Internet Explorer 11 (requires ES2015 polyfill)
* Mobile Chrome and Safari

# Questions
If you have any questions, please visit our [developer forum](https://community.box.com/t5/Box-Developer-Forum/bd-p/DeveloperForum) or contact us via one of our [available support channels](https://community.box.com/t5/Community/ct-p/English).

# Copyright and License
Copyright 2016-present Box, Inc. All Rights Reserved.

Licensed under the Box Software License Agreement v.20170516.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at

   https://developer.box.com/docs/box-sdk-license

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
