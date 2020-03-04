`import ContentUploader from 'box-ui-elements/es/elements/content-uploader';`

### Screenshot

## <img src="https://user-images.githubusercontent.com/1075325/27887153-09243762-6194-11e7-8d2d-cf654d9364bc.png" style="border: 1px solid #e8e8e8" width="600" />

[Documentation](https://developer.box.com/docs/box-content-uploader)

### Props

| Prop                | Type                                                                           | Default | Description                                                                                            |
| ------------------- | ------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------ |
| token\*             | string                                                                         |         | _See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options)._       |
| isTouch             | boolean                                                                        |         | _See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options)._       |
| language            | string                                                                         |         | _See the [Internationalization](../README.md#internationalization) section_                            |
| logoUrl             | string                                                                         |         | _See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options)._       |
| messages            | Map<string, string>                                                            |         | _See the [Internationalization](../README.md#internationalization) section_                            |
| onBeforeUpload      | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |         | Callback function for retrieving an item before it has uploaded on files only, doesn't work on folders |
| onClickCancel       | function                                                                       |         | Callback function for canceling a file upload after click                                              |
| onClickResume       | function                                                                       |         | Callback function for resuming a file upload after click                                               |
| onClickRetry        | function                                                                       |         | Callback function for retrying a file upload after click                                               |
| onClose             | function                                                                       |         | Callback function for when the close button is pressed.                                                |
| onComplete          | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |         | Callback function for when uploads are complete.                                                       |
| onProgress          | function([File](https://developer.box.com/reference#file-object))              |         | Callback function for when uploads are in progress.                                                    |
| onResume            | function([File](https://developer.box.com/reference#file-object))              |         | Callback function for resuming a file upload.                                                          |
| requestInterceptor  | function                                                                       |         | _See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options)._       |
| responseInterceptor | function                                                                       |         | _See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options)._       |
| rootFolderId        | string                                                                         | `0`     | The root folder for the content uploader.                                                              |
| sharedLink          | string                                                                         |         | _See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options)._       |
| sharedLinkPassword  | string                                                                         |         | _See the [developer docs](https://developer.box.com/docs/box-content-uploader#section-options)._       |
