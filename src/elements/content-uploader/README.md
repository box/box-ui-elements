### Demo ([Documentation](https://developer.box.com/docs/box-content-uploader))
```jsx
var ContentUploader = require('./ContentUploader').default;

<IntlProvider locale="en">
    <ContentUploader
        features={FEATURES}
        rootFolderId={FOLDER_ID}
        token={TOKEN}
    />
</IntlProvider>
```

### Screenshot
<img src="https://user-images.githubusercontent.com/1075325/27887153-09243762-6194-11e7-8d2d-cf654d9364bc.png" style="border: 1px solid #e8e8e8" width="600" />
---

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| isTouch | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| language | string |  | *See the [Internationalization](../README.md#internationalization) section* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| messages | Map<string, string> |  | *See the [Internationalization](../README.md#internationalization) section* |
| onBeforeUpload | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for retrieving an item before it has uploaded on files only, doesn't work on folders|
| onClickCancel | function |  | Callback function for canceling a file upload after click |
| onClickResume | function |  | Callback function for resuming a file upload after click |
| onClickRetry | function |  | Callback function for retrying a file upload after click |
| onClose | function |  | Callback function for when the close button is pressed. |
| onComplete | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when uploads are complete. |
| onProgress | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for when uploads are in progress. |
| onResume | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for resuming a file upload. |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| rootFolderId | string | `0` | The root folder for the content uploader. |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options).* |
