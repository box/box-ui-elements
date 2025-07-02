<p align="center">
  <img width="50%" alt="Box Elements logo" src="https://repository-images.githubusercontent.com/95743138/c161b500-021b-11ea-8bf9-3aa8776acdec" />
  <img width="50%" alt="Box Developer logo" src="https://raw.githubusercontent.com/box/sdks/ded98439b27c2e635c45607131c54e1b6075e252/images/box-dev-logo.png" />
</p>

[![Project Status](https://img.shields.io/badge/status-active-brightgreen.svg)](http://opensource.box.com/badges)
[![CircleCI](https://circleci.com/gh/box/box-ui-elements/tree/master.svg?style=shield)](https://circleci.com/gh/box/box-ui-elements/tree/master)
[![Styled With Prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://gh.mergify.io/badges/box/box-ui-elements&style=flat)](https://mergify.io)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

<a href="https://www.npmjs.com/package/box-ui-elements">
  <img alt="npm latest version" src="https://img.shields.io/npm/v/box-ui-elements/latest.svg">
</a>
<a href="https://www.npmjs.com/package/box-ui-elements">
  <img alt="npm beta version" src="https://img.shields.io/npm/v/box-ui-elements/beta.svg">
</a>

# [Box UI Elements](https://developer.box.com/docs/box-ui-elements)

Box UI Elements are pre-built UI components that allow developers to add features of the main Box web application into their own applications. Use Box UI Elements to navigate through, upload, preview, and select content stored on Box. Box UI Elements are available as React components and framework-agnostic JavaScript libraries.

# [Demo](https://opensource.box.com/box-ui-elements/)

*Please note that the demo page has limited functionality.*

## Installation

`yarn add box-ui-elements` or `npm install box-ui-elements`

To prevent library duplication, the UI Elements require certain peer dependencies to be installed manually. For a list of required peer dependencies, see [package.json](package.json).

# Usage

This documentation describes how to use UI Elements in a [React](https://facebook.github.io/react) application using [webpack](https://webpack.js.org/). If instead you require a framework-agnostic solution, please refer to our [developer documentation](https://developer.box.com/docs/box-ui-elements). You can also reference our [Elements Demo App](https://github.com/box/box-ui-elements-demo) and [Preview Demo App](https://github.com/box/box-content-preview-demo) for examples of minimal React applications using ContentExplorer and ContentPreview, respectively.

### Common

- [Authentication](src/elements/README.md#authentication)
- [Internationalization (i18n)](src/elements/README.md#internationalization)

### Elements

- [ContentExplorer](src/elements/content-explorer/README.md)
- [ContentOpenWith](src/elements/content-open-with/README.md)
- [ContentPicker](src/elements/content-picker/README.md)
- [ContentPreview](src/elements/content-preview/README.md)\*
- [ContentSidebar](src/elements/content-sidebar/README.md)\*
- [ContentUploader](src/elements/content-uploader/README.md)

\* _These components utilize code splitting. See the [Code Splitting](#code-splitting) section for more information._

### Code Splitting

[Code splitting](https://webpack.js.org/guides/code-splitting/) is currently supported for some UI Elements. In order to use an Element with code splitting, you need to set it up in webpack.

### Stylesheets

Box UI Elements use [SCSS stylesheets](https://sass-lang.com/guide). Each of the Elements include their corresponding SCSS stylesheet to render properly. Once you `import` an Element within your React app, the corresponding stylesheet will automatically get included. However, you will need to [setup webpack](https://github.com/webpack-contrib/mini-css-extract-plugin#minimal-example) to handle `.scss` files by using the sass-loader / css-loader. This will direct webpack to properly include our SCSS files in your final CSS output. A sample configuration is [shown here](https://github.com/box/box-ui-elements-demo/blob/master/webpack.config.js) under the rules section.

### Browser Support

- Desktop Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile Chrome and Safari

# Contributing

Our contributing guidelines can be found in [CONTRIBUTING.md](CONTRIBUTING.md). The development setup instructions can be found in [DEVELOPING.md](DEVELOPING.md).

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

