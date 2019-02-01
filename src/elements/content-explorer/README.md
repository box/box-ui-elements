## Content Explorer ([Documentation](https://developer.box.com/docs/box-content-explorer))

<img src="https://user-images.githubusercontent.com/1075325/27887154-092a232a-6194-11e7-82f4-697331ac5cbe.png" width="75%"/>

### Usage
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
| language | string | `en-US` | *See the [Internationalization](../README.md#internationalization) section* |
| messages | Map<string, string> |  | *See the [Internationalization](../README.md#internationalization) section* |
| rootFolderId | string | `0` | The root folder for the content explorer. |
| currentFolderId | string | | The current folder shown for the content explorer. This should be a sub folder to the root folder. |
| initialPage | number | 1 | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| initialPageSize | number | 50 | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
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
| contentPreviewProps | Object | `{}` | Props that can be forwarded to the Content Preview UI Element. *See them in the props section of [Content Preview UI Element](#content-preview-documentation)* |

### Keyboard Shortcuts
*See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-keyboard-shortcuts).*

