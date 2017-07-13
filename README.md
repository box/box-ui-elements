[![Project Status](https://img.shields.io/badge/status-active-brightgreen.svg?style=flat-square)](http://opensource.box.com/badges)
[![Styled With Prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![build status](https://img.shields.io/travis/box/box-ui-elements/master.svg?style=flat-square)](https://travis-ci.com/box/box-ui-elements)
[![npm version](https://img.shields.io/npm/v/box-ui-elements.svg?style=flat-square)](https://www.npmjs.com/package/box-ui-elements)


[Box UI Elements](https://developer.box.com/docs/box-ui-elements)
==========================================================================
Box UI Elements are pre-built UI components that allow developers to add features of the main Box web application into their own applications. They can be used to navigate through, upload, preview, and select content stored on Box and are available both as React components and framework-agnostic JavaScript libraries.

## Documentation
Visit our [developer documentation](https://developer.box.com/docs/box-ui-elements) for detailed information on how to use and configure each UI Element.

## Browser Support
* Desktop Chrome, Firefox, Safari, Edge (latest 2 versions)
* Limited support for Internet Explorer 11 (requires ES2015/Intl polyfill)
* Mobile Chrome and Safari

Box UI Elements require an ES2015-capable browser supporting Intl (ECMAScript Internationalization API). If your application supports Internet Explorer 11 or Safari 9, please include your favorite polyfill library or a service like polyfill.io to smartly load only the polyfills your users need.

## Current Version
* 1.0.1

## Supported Locales
`en-AU`, `en-CA`, `en-GB`, `en-US`, `da-DK`, `de-DE`, `es-ES`, `fi-FI`, `fr-CA`, `fr-FR`, `it-IT`, `ja-JP`, `ko-KR`, `nb-NO`, `nl-NL`, `pl-PL`, `pt-BR`, `ru-RU`, `sv-SE`, `tr-TR`, `zh-CN`, `zh-TW`

Read the [developer documentation](https://developer.box.com/docs/box-ui-elements) for how to use different locales.

## Usage
The instructions below describe how to use the UI Elements in a [React](https://facebook.github.io/react) application. If you would like to include the language-agnostic libraries as scripts, refer to our [developer documentation](https://developer.box.com/docs/box-ui-elements). Continue reading below for how to import the UI Elements as components into your React application. You can also reference https://github.com/box/box-ui-elements-demo for a minimal React application using the Explorer UI Element.

## Installation
`yarn add box-ui-elements` or `npm install box-ui-elements`

## Authentication
We have designed the Box UI Elements in an authentication-type agnostic way. Whether you are using them for users who have Box accounts (Managed Users) or non-Box accounts (App Users), they should just work out of the box. They only expect an **access token** to be passed in for authentication. The [developer documentation](https://developer.box.com/docs/box-ui-elements) contains more information on how to generate and use these access tokens.

## CSS
The Box UI Elements require their corresponding CSS stylesheets to render properly. You will need to set up Webpack's style-loader and css-loader in order to properly include the CSS like in the examples below. Alternatively, you can include the appropriate CSS files in your application's HTML without importing it in React. Links to hosted versions of these CSS files on the Box CDN can be found in the documentation links below.

## Components
You can import the `ContentExplorer`, `ContentPicker`, `ContentUploader`, `ContentPreview` or `ContentTree`. Similarly, you can also import the `ContentPickerPopup`, `ContentUploaderPopup` or `ContentTreePopup` which are popup versions for the Content Picker, Content Uploader and Content Tree, respectively.

## Content Explorer ([Documentation](https://developer.box.com/docs/box-content-explorer))

<img src="https://user-images.githubusercontent.com/1075325/27887154-092a232a-6194-11e7-82f4-697331ac5cbe.png" width="75%"/>

```js
import React from 'react';
import { render } from 'react-dom';
import { ContentExplorer } from 'box-ui-elements';
import messages from 'box-ui-elements/lib/i18n/en-US';
import 'box-ui-elements/dist/explorer.css';

const token = 'ACCESS_TOKEN';
const getLocalizedMessage = (id, replacements) =>
    messages[id].replace(/{\s*(\w+)\s*}/g, (match, key) => replacements[key]);

render(
    <ContentExplorer
        token={token}
        getLocalizedMessage={getLocalizedMessage}
    />,
    document.querySelector('.container')
);
```

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| getLocalizedMessage* | function(string, { [string]: string }) |  | Function to get localized strings. |
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
| onDelete | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when item(s) are deleted. |
| onDownload | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when item(s) are downloaded. |
| onPreview | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for when an item is previewed. |
| onRename | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for when an item is renamed. |
| onSelect | function(Array&lt;[Folder](https://developer.box.com/reference#folder-object)&#124;[File](https://developer.box.com/reference#file-object)&#124;[Web Link](https://developer.box.com/reference#web-link-object)&gt;) |  | Callback function for when item(s) are selected. |
| onUpload | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when item(s) are uploaded. |
| onNavigate | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for when navigating into a folder. |
| isTouch | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| autoFocus | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |

### Keyboard Shortcuts
*See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-keyboard-shortcuts).*


## Content Picker ([Documentation](https://developer.box.com/docs/box-content-picker))

<img src="https://user-images.githubusercontent.com/1075325/27887156-0940ee3e-6194-11e7-8e22-961139e82dfe.png" width="75%"/>

```js
import React from 'react';
import { render } from 'react-dom';
import { ContentPicker } from 'box-ui-elements';
import messages from 'box-ui-elements/lib/i18n/en-US';
import 'box-ui-elements/dist/picker.css';

const token = 'ACCESS_TOKEN';
const getLocalizedMessage = (id, replacements) =>
    messages[id].replace(/{\s*(\w+)\s*}/g, (match, key) => replacements[key]);

render(
    <ContentPicker
        token={token}
        getLocalizedMessage={getLocalizedMessage}
    />,
    document.querySelector('.container')
);
```

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| getLocalizedMessage* | function(string, { [string]: string }) |  | Function to get localized strings. |
| rootFolderId | string | `0` | The root folder for the content picker. |
| type | string | `file, web_link` | Indicates which type of items can be picked. Should be a comma seperated combination of `file`, `folder` or `web_link`. |
| sortBy | string | `name` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| sortDirection | string | `asc` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| extensions | Array&lt;string&gt; | `[]` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| maxSelectable | number | `Infinity` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| canUpload | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| canSetShareAccess | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| onCancel | function |  | Callback function for when the cancel button is pressed. |
| onChoose | function |  | Callback function for when the choose button is pressed. |
| isTouch | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| autoFocus | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |

### Keyboard Shortcuts
*See the [developer docs](https://developer.box.com/docs/box-content-picker#section-keyboard-shortcuts).*


## Content Uploader ([Documentation](https://developer.box.com/docs/box-content-uploader))
<img src="https://user-images.githubusercontent.com/1075325/27887153-09243762-6194-11e7-8d2d-cf654d9364bc.png" width="75%"/>

```js
import React from 'react';
import { render } from 'react-dom';
import { ContentUploader } from 'box-ui-elements';
import messages from 'box-ui-elements/lib/i18n/en-US';
import 'box-ui-elements/dist/uploader.css';

const token = 'ACCESS_TOKEN';
const getLocalizedMessage = (id, replacements) =>
    messages[id].replace(/{\s*(\w+)\s*}/g, (match, key) => replacements[key]);

render(
    <ContentUploader
        token={token}
        getLocalizedMessage={getLocalizedMessage}
    />,
    document.querySelector('.container')
);
```

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| getLocalizedMessage* | function(string, { [string]: string }) |  | Function to get localized strings. |
| rootFolderId | string | `0` | The root folder for the content uploader. |
| onClose | function |  | Callback function for when the close button is pressed. |
| onComplete | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when uploads are complete. |
| isTouch | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |


## Content Tree ([Documentation](https://developer.box.com/docs/box-content-tree))

<img src="https://user-images.githubusercontent.com/1075325/27887155-092e7362-6194-11e7-877d-157726789bef.png" width="75%"/>

```js
import React from 'react';
import { render } from 'react-dom';
import { ContentTree } from 'box-ui-elements';
import messages from 'box-ui-elements/lib/i18n/en-US';
import 'box-ui-elements/dist/tree.css';

const token = 'ACCESS_TOKEN';
const getLocalizedMessage = (id, replacements) =>
    messages[id].replace(/{\s*(\w+)\s*}/g, (match, key) => replacements[key]);

render(
    <ContentTree
        token={token}
        getLocalizedMessage={getLocalizedMessage}
    />,
    document.querySelector('.container')
);
```

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-tree#section-options).* |
| getLocalizedMessage* | function(string, { [string]: string }) |  | Function to get localized strings. |
| rootFolderId | string | `0` | The root folder for the content tree. |
| type | string | `file, web_link, folder` | Indicates which type of items show up in the tree. Should be a comma seperated combination of `file`, `folder` or `web_link`. |
| onClick | function([Folder](https://developer.box.com/reference#folder-object)&#124;[File](https://developer.box.com/reference#file-object)&#124;[Web Link](https://developer.box.com/reference#web-link-object)) |  | Callback function for when an item is clicked. |
| isTouch | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-tree#section-options).* |
| autoFocus | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-tree#section-options).* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-tree#section-options).* |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-tree#section-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-tree#section-options).* |


## Content Preview ([Documentation](https://developer.box.com/docs/box-content-preview))

<img src="https://user-images.githubusercontent.com/1075325/27419184-596b485c-56d4-11e7-8d42-c65328089c95.png" width="75%"/>

***The Box Content Preview has a slightly different interface than the other components. Instead of importing localizations like the examples above, it requires a locale (defaults to en-US) to be passed in. This will automatically pull in the corresponding preview bundle and dynamically load it. It will also dynamically load the required CSS file.***

```js
import React from 'react';
import { render } from 'react-dom';
import { ContentPreview } from 'box-ui-elements';

const token = 'ACCESS_TOKEN';
const fileId = 'FILE_ID';

render(
    <ContentPreview
        fileId={fileId}
        token={token}
    />,
    document.querySelector('.container')
);
```

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-initialization-and-options).* |
| fileId* | string | | The id of the file to preview. |
| locale | string | `en-US` | Locale for this component. |
| onLoad | function |  | Callback function for when a file preview loads. |
| collection | Array&lt;string&gt; | `[]` | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-initialization-and-options).* |
| header | string | `light` | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-initialization-and-options).* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-initialization-and-options).* |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-initialization-and-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-initialization-and-options).* |


## Questions
If you have any questions, please visit our [developer forum](https://community.box.com/t5/Box-Developer-Forum/bd-p/DeveloperForum) or contact us via one of our [available support channels](https://community.box.com/t5/Community/ct-p/English).

## Copyright and License
Copyright 2016-2017 Box, Inc. All Rights Reserved.

Licensed under the Box Software License Agreement v.20170516.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at [Box UI Elements Software License Agreement](https://developer.box.com/docs/box-ui-elements-license)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
