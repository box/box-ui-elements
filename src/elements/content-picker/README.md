### Demo ([Documentation](https://developer.box.com/docs/box-content-picker))
```jsx
var ContentPicker = require('./ContentPicker').default;

<IntlProvider locale="en">
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
| token* | string |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| autoFocus | boolean |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| cancelButtonLabel | string |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| canCreateNewFolder | boolean | `true` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| canSetShareAccess | boolean | `true` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| canUpload | boolean | `true` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| chooseButtonLabel | string |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| contentUploaderProps | Object | `{}` | Props to be forwarded to the `ContentUploader` UI Element.  *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/uploader/#Options).*
| currentFolderId | string | | The current folder shown for the content picker. This should be a sub folder to the root folder. |
| defaultView | string | `files` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| extensions | Array&lt;string&gt; | `[]` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| initialPage | number | 1 | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| initialPageSize | number | 50 | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| isTouch | boolean |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| language | string |  | *See the [Internationalization](../README.md#internationalization) section* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| maxSelectable | number | `Infinity` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| messages | Map<string, string> |  | *See the [Internationalization](../README.md#internationalization) section* |
| onCancel | function |  | Callback function for when the cancel button is pressed. |
| onChoose | function |  | Callback function for when the choose button is pressed. |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| rootFolderId | string | `0` | The root folder for the content picker. |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| sortBy | string | `name` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| sortDirection | string | `asc` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/picker/#Options).* |
| type | string | `file, web_link` | Indicates which type of items can be picked. Should be a comma seperated combination of `file`, `folder` or `web_link`. |

### Keyboard Shortcuts
*See the [developer docs](https://developer.box.com/docs/box-content-picker#section-keyboard-shortcuts).*

