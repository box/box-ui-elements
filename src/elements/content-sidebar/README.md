## Content Sidebar ([Documentation](https://developer.box.com/docs/box-content-sidebar))

<img src="https://user-images.githubusercontent.com/1075325/50999865-3707d200-14e0-11e9-8488-81a4e2a5fe43.png" width="40%"/>

### Usage
```js
import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import { ContentSidebar } from 'box-ui-elements';
import messages from 'box-ui-elements/i18n/en-US';
import 'box-ui-elements/dist/sidebar.css';

addLocaleData(enLocaleData);

render(
    <ContentSidebar
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
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| language | string | `en-US` | *See the [Internationalization](../README.md#internationalization) section* |
| messages | Map<string, string> |  | *See the [Internationalization](../README.md#internationalization) section* |
| fileId* | string | | The id of the file to preview. |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| hasActivityFeed | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| hasMetadata | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| hasSkills | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| detailsSidebarProps | Object | `{}` | *See below* |
| activitySidebarProps | Object | `{}` | *See below* |
| metadataSidebarProps | Object | `{}` | *See below* |
| skillsSidebarProps | Object | `{}` | *See below* |


### detailsSidebarProps
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| hasProperties | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-detailssidebarprops).* |
| hasAccessStats | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-detailssidebarprops).* |
| hasVersions | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-detailssidebarprops).* |
| hasNotices | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-detailssidebarprops).* |

### activitySidebarProps
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| onCommentCreate | function | | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-activitySidebarProps).* |
| onCommentDelete | function | | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-activitySidebarProps).* |

### metadataSidebarProps
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| *tbd* | - | - | - |

### skillsSidebarProps
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| *tbd* | - | - | - |
