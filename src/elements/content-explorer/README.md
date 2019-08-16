### Demo ([Documentation](https://developer.box.com/docs/box-content-explorer))
```jsx
var ContentExplorer = require('./ContentExplorer').default;

<IntlProvider locale="en" textComponent={React.Fragment}>
    <ContentExplorer
        contentPreviewProps={{
            contentSidebarProps: {
                detailsSidebarProps: {
                    hasProperties: true,
                    hasNotices: true,
                    hasAccessStats: true,
                    hasClassification: true,
                    hasRetentionPolicy: true,
                    hasVersions: true,
                },
                features: FEATURES,
                hasActivityFeed: true,
                hasMetadata: true,
                hasSkills: true,
            },
        }}
        features={FEATURES}
        rootFolderId={FOLDER_ID}
        token={TOKEN}
    />
</IntlProvider>
```

### Screenshot
<img src="https://user-images.githubusercontent.com/1075325/27887154-092a232a-6194-11e7-82f4-697331ac5cbe.png" style="border: 1px solid #e8e8e8;" style="border: 1px solid #e8e8e8;" width="600" />
---

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| autoFocus | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canCreateNewFolder | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canDelete | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canDownload | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canPreview | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canRename | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canSetShareAccess | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canShare | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| canUpload | boolean | `true` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| contentPreviewProps | Object | `{}` | Props that can be forwarded to the Content Preview UI Element. *See them in the props section of [Content Preview UI Element](#content-preview-documentation)* |
| currentFolderId | string | | The current folder shown for the content explorer. This should be a sub folder to the root folder. |
| defaultView | string | `files` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| initialPage | number | 1 | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| initialPageSize | number | 50 | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| isTouch | boolean |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| language | string | `en-US` | *See the [Internationalization](../README.md#internationalization) section* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| messages | Map<string, string> |  | *See the [Internationalization](../README.md#internationalization) section* |
| onCreate | [Folder](https://developer.box.com/reference#folder-object)&gt;) |  | Callback function for when a folder is created. |
| onDelete | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when item(s) are deleted. |
| onDownload | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when item(s) are downloaded. |
| onNavigate | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for when navigating into a folder. |
| onPreview | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for when an item is previewed. |
| onRename | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for when an item is renamed. |
| onSelect | function(Array&lt;[Folder](https://developer.box.com/reference#folder-object)&#124;[File](https://developer.box.com/reference#file-object)&#124;[Web Link](https://developer.box.com/reference#web-link-object)&gt;) |  | Callback function for when item(s) are selected. |
| onUpload | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when item(s) are uploaded. |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| rootFolderId | string | `0` | The root folder for the content explorer. |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| sortBy | string | `name` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |
| sortDirection | string | `asc` | *See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-options).* |

### Keyboard Shortcuts
*See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-keyboard-shortcuts).*

