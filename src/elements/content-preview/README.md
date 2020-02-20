### Demo ([Documentation](https://developer.box.com/docs/box-content-preview))
***IMPORTANT:*** The Content Preview UI Element works differently from the other UI Elements above. The React component is a wrapper for the [Preview library](https://developer.box.com/docs/box-content-preview). It also requires a langauge (defaults to en-US) to be passed in since the preview library bundles are localized. Providing a language will automatically pull in the corresponding preview.js bundle and dynamically load it by adding a script tag. It will also dynamically load the additional required preview.css file by adding a link tag.

```jsx
var ContentPreview = require('./ContentPreview').default;

<IntlProvider locale="en">
    <ContentPreview
        contentSidebarProps={{
            detailsSidebarProps: {
                hasAccessStats: true,
                hasClassification: true,
                hasNotices: true,
                hasProperties: true,
                hasRetentionPolicy: true,
                hasVersions: true,
            },
            features: FEATURES,
            hasActivityFeed: true,
            hasMetadata: true,
            hasSkills: true,
            hasVersions: true,
        }}
        hasHeader={true}
        features={FEATURES}
        fileId={FILE_ID}
        token={TOKEN}
        {...PROPS}
    />
</IntlProvider>
```

### Screenshot
<img src="https://user-images.githubusercontent.com/1075325/27419184-596b485c-56d4-11e7-8d42-c65328089c95.png" style="border: 1px solid #e8e8e8;" width="600" />
---

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| fileId* | string | | The id of the file to preview. |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| canDownload | boolean | `true` | Visually hides the download and print buttons in the preview header if this is set to `false`. *This prop has no effect when the file permission `can_download` is set to `false`.* |
| collection | Array&lt;string&gt; | `[]` | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| contentOpenWithProps | Object | `{}` | Props that can be forwarded to the Content Open With UI Element. *See them in the props section of [Content Open With UI Element](#content-open-with-documentation)* |
| contentSidebarProps | Object | `{}` | Props that can be forwarded to the Content Sidebar UI Element. *See them in the props section of [Content Sidebar UI Element](#content-sidebar-documentation)* |
| hasHeader | boolean | `true` | Visually hides the preview header if this is set to `false`. |
| language | string | `en-US` | *See the [Internationalization](../README.md#internationalization) section* |
| messages | Map<string, string> |  | *See the [Internationalization](../README.md#internationalization) section* |
| onClose | function |  | Callback function for when the file preview closes. If absent, the close button will not render in the header. |
| onLoad | function |  | Callback function for when a file preview loads. |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |
| showAnnotations | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-preview#section-options).* |

***Note***: Any other option listed here https://github.com/box/box-content-preview#parameters--options, which is also not listed or overriden above as a prop, will be passed on as-is to the Preview Library.
