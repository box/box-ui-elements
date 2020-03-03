`import ContentPreview from 'box-ui-elements/es/elements/content-preview';`

### Screenshot

## <img src="https://user-images.githubusercontent.com/1075325/27419184-596b485c-56d4-11e7-8d42-c65328089c95.png" style="border: 1px solid #e8e8e8;" width="600" />

### Props

| Prop                 | Type                | Default | Description                                                                                                                                                                         |
| -------------------- | ------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fileId\*             | string              |         | The id of the file to preview.                                                                                                                                                      |
| token\*              | string              |         | _See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options)._                                                                                     |
| canDownload          | boolean             | `true`  | Visually hides the download and print buttons in the preview header if this is set to `false`. _This prop has no effect when the file permission `can_download` is set to `false`._ |
| collection           | Array&lt;string&gt; | `[]`    | _See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options)._                                                                                     |
| contentOpenWithProps | Object              | `{}`    | Props that can be forwarded to the Content Open With UI Element. _See them in the props section of [Content Open With UI Element](#content-open-with-documentation)_                |
| contentSidebarProps  | Object              | `{}`    | Props that can be forwarded to the Content Sidebar UI Element. _See them in the props section of [Content Sidebar UI Element](#content-sidebar-documentation)_                      |
| hasHeader            | boolean             | `true`  | Visually hides the preview header if this is set to `false`.                                                                                                                        |
| language             | string              | `en-US` | _See the [Internationalization](../README.md#internationalization) section_                                                                                                         |
| messages             | Map<string, string> |         | _See the [Internationalization](../README.md#internationalization) section_                                                                                                         |
| onClose              | function            |         | Callback function for when the file preview closes. If absent, the close button will not render in the header.                                                                      |
| onLoad               | function            |         | Callback function for when a file preview loads.                                                                                                                                    |
| requestInterceptor   | function            |         | _See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options)._                                                                                     |
| responseInterceptor  | function            |         | _See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options)._                                                                                     |
| sharedLink           | string              |         | _See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options)._                                                                                     |
| sharedLinkPassword   | string              |         | _See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options)._                                                                                     |
| showAnnotations      | boolean             | `true`  | _See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options)._                                                                                     |

**_Note_**: Any other option listed here https://github.com/box/box-content-preview#parameters--options, which is also not listed or overriden above as a prop, will be passed on as-is to the Preview Library.
