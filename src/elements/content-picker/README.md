## Content Picker ([Documentation](https://developer.box.com/docs/box-content-picker))

<img src="https://user-images.githubusercontent.com/1075325/27887156-0940ee3e-6194-11e7-8e22-961139e82dfe.png" width="75%"/>

### Usage
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
| language | string |  | *See the [Internationalization](../README.md#internationalization) section* |
| messages | Map<string, string> |  | *See the [Internationalization](../README.md#internationalization) section* |
| rootFolderId | string | `0` | The root folder for the content picker. |
| currentFolderId | string | | The current folder shown for the content picker. This should be a sub folder to the root folder. |
| type | string | `file, web_link` | Indicates which type of items can be picked. Should be a comma seperated combination of `file`, `folder` or `web_link`. |
| initialPage | number | 1 | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| initialPageSize | number | 50 | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
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

