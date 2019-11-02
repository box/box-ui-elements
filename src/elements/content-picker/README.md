### Demo ([Documentation](https://developer.box.com/docs/box-content-picker))
```jsx
var ContentPicker = require('./ContentPicker').default;

<IntlProvider locale="en" textComponent={React.Fragment}>
    <ContentPicker
        features={FEATURES}
        rootFolderId={FOLDER_ID}
        token={TOKEN}
        {...PROPS}
    />
</IntlProvider>
```

### Screenshot
<img src="https://user-images.githubusercontent.com/1075325/27887156-0940ee3e-6194-11e7-8e22-961139e82dfe.png" style="border: 1px solid #e8e8e8" width="600" />
---

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| autoFocus | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| cancelButtonLabel | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| canCreateNewFolder | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| canSetShareAccess | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| canUpload | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| chooseButtonLabel | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| currentFolderId | string | | The current folder shown for the content picker. This should be a sub folder to the root folder. |
| defaultView | string | `files` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| extensions | Array&lt;string&gt; | `[]` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| initialPage | number | 1 | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| initialPageSize | number | 50 | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| isTouch | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| language | string |  | *See the [Internationalization](../README.md#internationalization) section* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| maxSelectable | number | `Infinity` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| messages | Map<string, string> |  | *See the [Internationalization](../README.md#internationalization) section* |
| onCancel | function |  | Callback function for when the cancel button is pressed. |
| onChoose | function |  | Callback function for when the choose button is pressed. |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| rootFolderId | string | `0` | The root folder for the content picker. |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| sortBy | string | `name` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| sortDirection | string | `asc` | *See the [developer docs](https://developer.box.com/docs/box-content-picker#section-options).* |
| type | string | `file, web_link` | Indicates which type of items can be picked. Should be a comma seperated combination of `file`, `folder` or `web_link`. |

### Keyboard Shortcuts
*See the [developer docs](https://developer.box.com/docs/box-content-picker#section-keyboard-shortcuts).*

