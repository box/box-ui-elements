### Screenshot
<img src="https://user-images.githubusercontent.com/1075325/27887153-09243762-6194-11e7-8d2d-cf654d9364bc.png" width="75%"/>
---

### Demo ([Documentation](https://developer.box.com/docs/box-content-uploader))
```jsx
var ContentUploader = require('./ContentUploader').default;

<IntlProvider locale="en" textComponent={React.Fragment}>
    <ContentUploader
        features={FEATURES}
        rootFolderId={FOLDER_ID}
        token={TOKEN}
    />
</IntlProvider>
```

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| language | string |  | *See the [Internationalization](../README.md#internationalization) section* |
| messages | Map<string, string> |  | *See the [Internationalization](../README.md#internationalization) section* |
| rootFolderId | string | `0` | The root folder for the content uploader. |
| onClose | function |  | Callback function for when the close button is pressed. |
| onComplete | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when uploads are complete. |
| onBeforeUpload | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for retrieving an item before it has uploaded on files only, doesn't work on folders|
| isTouch | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
