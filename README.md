[![Project Status](https://img.shields.io/badge/status-active-brightgreen.svg?style=flat-square)](http://opensource.box.com/badges)
[![Styled With Prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![build status](https://img.shields.io/travis/box/box-ui-elements/master.svg?style=flat-square)](https://travis-ci.org/box/box-ui-elements)
[![npm version](https://img.shields.io/npm/v/box-ui-elements.svg?style=flat-square)](https://www.npmjs.com/package/box-ui-elements)


[Box UI Elements](https://developer.box.com/docs/box-ui-elements)
==========================================================================
Box UI Elements are pre-built UI components that allow developers to add features of the main Box web application into their own applications. They can be used to navigate through, upload, preview, and select content stored on Box and are available both as React components and framework-agnostic JavaScript libraries.

# Usage
The instructions below describe how to use the UI Elements in a [React](https://facebook.github.io/react) application. If instead you would like to include the framework-agnostic libraries as scripts, refer to our [developer documentation](https://developer.box.com/docs/box-ui-elements). Continue reading below for how to import the UI Elements as React components. You can also reference https://github.com/box/box-ui-elements-demo or https://github.com/box/box-content-preview-demo for minimal React applications using the Explorer UI Element and Preview UI Element respectively.

**IMPORTANT: The Preview UI Element listed below is a simple React *wrapper* for the [preview library](https://github.com/box/box-content-preview). The react component dynamically adds the preview library to the DOM via a `<script>` tag. The preview library assets will come from Box's CDN and currently there is no pure NPM version for it.**

## Installation
`yarn add box-ui-elements` or `npm install box-ui-elements`

To prevent library duplication, the UI Elements require certain peer dependencies to be installed manually. For a list of required peer dependencies, see [package.json](package.json).

## Browser Support
* Desktop Chrome, Firefox, Safari, Edge (latest 2 versions)
* Limited support for Internet Explorer 11 (requires ES2015 polyfill)
* Mobile Chrome and Safari

## Internationalization
The UI Elements use [react-intl](https://github.com/yahoo/react-intl) to do internationalization. In order for the UI Elements to render properly, they need to be wrapped in an [IntlProvider](https://github.com/yahoo/react-intl/wiki/Components#intlprovider) context and given a locale and translated messages to use. Each of the UI Element components below optionally take in a `language` property and a `messages` property which is then delegated to our internal [IntlProvider](src/components/Internationalize.js). If either of these properties are not passed in, we do not use our internal `IntlProvider` and it is assumed that the parent react app (the react app that is importing in the UI Elements) has its own `IntlProvider`.

The `language` property is a string that can be one of `en-AU`, `en-CA`, `en-GB`, `en-US`, `bn-IN`, `da-DK`, `de-DE`, `es-419`, `es-ES`, `fi-FI`, `fr-CA`, `fr-FR`, `hi-IN`, `it-IT`, `ja-JP`, `ko-KR`, `nb-NO`, `nl-NL`, `pl-PL`, `pt-BR`, `ru-RU`, `sv-SE`, `tr-TR`, `zh-CN`, `zh-TW`.

The `messages` property is a map of message keys and translated strings. All the messages that the UI elements use can be found under the [i18n](i18n) folder. We distribute them as JS modules within the `box-ui-elements` npm package and they can be imported like any other module. We provide translated strings for all the langauges listed above.

For `react-intl` to work properly, locale data needs to be added via [addlocaledata](https://github.com/yahoo/react-intl/wiki/API#addlocaledata). They are all bundled inside the `react-intl` package inside `node_modules`. By default it uses the `en` locale but for any other locale you have to do similar to the following before rendering the component:
```
import { addLocaleData } from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';
addLocaleData(frLocaleData);
```

The messages that are needed for the components can be imported from `box-ui-elements/i18n/[LANGUAGE]` package under `node_modules`. The code examples for each of the UI Elements below assume `en-US` and show how the US english messages are imported in.

## Authentication
We have designed the Box UI Elements in an authentication-type agnostic way. Whether you are using them for users who have Box accounts (Managed Users) or non-Box accounts (App Users), they should just work out of the box. They only expect an **access token** to be passed in for authentication. The [developer documentation](https://developer.box.com/docs/box-ui-elements) contains more information on how to generate and use these access tokens.

## CSS
The Box UI Elements require their corresponding CSS stylesheets to render properly. You will need to set up Webpack's style-loader and css-loader in order to properly include the CSS like in the examples below. Alternatively, you can include the appropriate CSS files in your application's HTML without importing it in React. Links to hosted versions of these CSS files on the Box CDN can be found in the documentation links below.

# Components
You can import the `ContentExplorer`, `ContentPicker`, `ContentUploader`, `ContentPreview`. Similarly, you can also import the `ContentPickerPopup` and `ContentUploaderPopup` which are popup versions for the Content Picker and Content Uploader, respectively.

## Content Explorer ([Documentation](https://developer.box.com/docs/box-content-explorer))

<img src="https://user-images.githubusercontent.com/1075325/27887154-092a232a-6194-11e7-82f4-697331ac5cbe.png" width="75%"/>

```js
import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import { ContentExplorer } from 'box-ui-elements';
import messages from 'box-ui-elements/i18n/en-US';
import 'box-ui-elements/dist/explorer.css';

addLocaleData(enLocaleData);

render(
    <ContentExplorer
        token='ACCESS_TOKEN'
        language='en-US'
        messages={messages}
    />,
    document.querySelector('.container')
);
```

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| language | string |  | *See the [Internationalization](#internationalization) section* |
| messages | Map<string, string> |  | *See the [Internationalization](#internationalization) section* |
| rootFolderId | string | `0` | The root folder for the content explorer. |
| currentFolderId | string | | The current folder shown for the content explorer. This should be a sub folder to the root folder. |
| sortBy | string | `name` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| sortDirection | string | `asc` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canPreview | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canDownload | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canDelete | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canUpload | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canRename | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canShare | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canSetShareAccess | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canCreateNewFolder | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| onDelete | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when item(s) are deleted. |
| onDownload | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when item(s) are downloaded. |
| onPreview | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for when an item is previewed. |
| onRename | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for when an item is renamed. |
| onSelect | function(Array&lt;[Folder](https://developer.box.com/reference#folder-object)&#124;[File](https://developer.box.com/reference#file-object)&#124;[Web Link](https://developer.box.com/reference#web-link-object)&gt;) |  | Callback function for when item(s) are selected. |
| onUpload | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when item(s) are uploaded. |
| onCreate | [Folder](https://developer.box.com/reference#folder-object)&gt;) |  | Callback function for when a folder is created. |
| onNavigate | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for when navigating into a folder. |
| isTouch | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| autoFocus | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| defaultView | string | `files` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |

### Keyboard Shortcuts
*See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-keyboard-shortcuts).*


## Content Picker ([Documentation](https://developer.box.com/docs/box-content-picker))

<img src="https://user-images.githubusercontent.com/1075325/27887156-0940ee3e-6194-11e7-8e22-961139e82dfe.png" width="75%"/>

```js
import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import { ContentPicker } from 'box-ui-elements';
import messages from 'box-ui-elements/i18n/en-US';
import 'box-ui-elements/dist/picker.css';

addLocaleData(enLocaleData);

render(
    <ContentPicker
        token='ACCESS_TOKEN'
        language='en-US'
        messages={messages}
    />,
    document.querySelector('.container')
);
```

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| language | string |  | *See the [Internationalization](#internationalization) section* |
| messages | Map<string, string> |  | *See the [Internationalization](#internationalization) section* |
| rootFolderId | string | `0` | The root folder for the content picker. |
| currentFolderId | string | | The current folder shown for the content picker. This should be a sub folder to the root folder. |
| type | string | `file, web_link` | Indicates which type of items can be picked. Should be a comma seperated combination of `file`, `folder` or `web_link`. |
| sortBy | string | `name` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| sortDirection | string | `asc` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| extensions | Array&lt;string&gt; | `[]` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| maxSelectable | number | `Infinity` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| canUpload | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| canSetShareAccess | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| canCreateNewFolder | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| onCancel | function |  | Callback function for when the cancel button is pressed. |
| onChoose | function |  | Callback function for when the choose button is pressed. |
| isTouch | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| autoFocus | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| chooseButtonLabel | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| cancelButtonLabel | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| defaultView | string | `files` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |

### Keyboard Shortcuts
*See the [developer docs](https://developer.box.com/docs/box-content-picker#section-keyboard-shortcuts).*


## Content Uploader ([Documentation](https://developer.box.com/docs/box-content-uploader))
<img src="https://user-images.githubusercontent.com/1075325/27887153-09243762-6194-11e7-8d2d-cf654d9364bc.png" width="75%"/>

```js
import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import { ContentUploader } from 'box-ui-elements';
import messages from 'box-ui-elements/i18n/en-US';
import 'box-ui-elements/dist/uploader.css';

addLocaleData(enLocaleData);

render(
    <ContentUploader
        token='ACCESS_TOKEN'
        language='en-US'
        messages={messages}
    />,
    document.querySelector('.container')
);
```

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| language | string |  | *See the [Internationalization](#internationalization) section* |
| messages | Map<string, string> |  | *See the [Internationalization](#internationalization) section* |
| rootFolderId | string | `0` | The root folder for the content uploader. |
| onClose | function |  | Callback function for when the close button is pressed. |
| onComplete | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when uploads are complete. |
| isTouch | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |


## Content Preview ([Documentation](https://developer.box.com/docs/box-content-preview))

<img src="https://user-images.githubusercontent.com/1075325/27419184-596b485c-56d4-11e7-8d42-c65328089c95.png" width="75%"/>

***IMPORTANT: The Content Preview UI Element (React component) works slightly different from the other UI Elements above. The React component is a wrapper for the [Preview library](https://developer.box.com/docs/box-content-preview). It also requires a langauge (defaults to en-US) to be passed in since the preview library bundles are localized. Providing a language will automatically pull in the corresponding preview.js bundle and dynamically load it by adding a script tag. It will also dynamically load the additional required preview.css file by adding a link tag.***

```js
import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import { ContentPreview } from 'box-ui-elements';
import messages from 'box-ui-elements/i18n/en-US';
import 'box-ui-elements/dist/preview.css';

addLocaleData(enLocaleData);

render(
    <ContentPreview
        fileId='FILE_ID'
        token='ACCESS_TOKEN'
        language='en-US'
        messages={messages}
    />,
    document.querySelector('.container')
);
```

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| fileId* | string | | The id of the file to preview. |
| language | string | `en-US` | *See the [Internationalization](#internationalization) section* |
| messages | Map<string, string> |  | *See the [Internationalization](#internationalization) section* |
| onLoad | function |  | Callback function for when a file preview loads. |
| collection | Array&lt;string&gt; | `[]` | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| showAnnotations | boolean | false | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| showDownload | boolean | false | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| header | string | `light` | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |


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
