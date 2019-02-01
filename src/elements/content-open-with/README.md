## Content Open With ([Documentation](https://developer.box.com/docs/box-content-open-with))

<img src="https://cdn-images-1.medium.com/max/1600/1*dd2YfUFtbt9z6Lrv6hNF_g.gif" width="75%"/>

### Usage
```js
import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import { ContentOpenWith } from 'box-ui-elements';
import messages from 'box-ui-elements/i18n/en-US';
import 'box-ui-elements/dist/openwith.css';

addLocaleData(enLocaleData);

render(
    <ContentOpenWith
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
| dropdownAlignment | string | _left_ or _right_ | Determines the dropdown's alignment to the Open With button. |
| boxToolsName | string | _Box Tools_ | This string will replace the name of Box Tools in the _Install Box Tools to open this file on your desktop_ message. |
| boxToolsInstallUrl | string | Box's install instructions | This URL will be used instead of the default Box installation instructions which are linked in the _Install Box Tools to open this file on your desktop_ message. |
| onExecute | Function | | A callback that executes when an integration invocation is attempted. |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| language | string | `en-US` | *See the [Internationalization](../README.md#internationalization) section* |
| messages | Map<string, string> |  | *See the [Internationalization](../README.md#internationalization) section* |
| fileId* | string | | The id of the file to preview. |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |

