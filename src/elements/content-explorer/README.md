### Demo ([Documentation](https://developer.box.com/docs/box-content-explorer))
```jsx
var ContentExplorer = require('./ContentExplorer').default;

<IntlProvider locale="en">
    <ContentExplorer
        contentPreviewProps={{
            contentSidebarProps: {
                detailsSidebarProps: {
                    hasProperties: true,
                    hasNotices: true,
                    hasAccessStats: true,
                    hasClassification: true,
                    hasRetentionPolicy: true,
                },
                features: FEATURES,
                hasActivityFeed: true,
                hasMetadata: true,
                hasSkills: true,
                hasVersions: true,
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
| token* | string |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| autoFocus | boolean |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| canCreateNewFolder | boolean | `true` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| canDelete | boolean | `true` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| canDownload | boolean | `true` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| canPreview | boolean | `true` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| canRename | boolean | `true` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| canSetShareAccess | boolean | `true` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| canShare | boolean | `true` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| canUpload | boolean | `true` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| contentPreviewProps | Object | `{}` | Props to be forwarded to the `ContentPreview` UI Element. *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/preview/#Options).* |
| contentUploaderProps | Object | `{}` | Props to be forwarded to the `ContentUploader` UI Element. *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/uploader/#Options).*
| currentFolderId | string | | The current folder shown for the content explorer. This should be a sub folder to the root folder. |
| defaultView | string | `files` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| initialPage | number | 1 | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| initialPageSize | number | 50 | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| isTouch | boolean |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| language | string | `en-US` | *See the [Internationalization](../README.md#internationalization) section* |
| logoUrl | string |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| messages | Map<string, string> |  | *See the [Internationalization](../README.md#internationalization) section* |
| onCreate | [Folder](https://developer.box.com/reference#folder-object)&gt;) |  | Callback function for when a folder is created. |
| onDelete | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when item(s) are deleted. |
| onDownload | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when item(s) are downloaded. |
| onNavigate | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for when navigating into a folder. |
| onPreview | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for when an item is previewed. |
| onRename | function([File](https://developer.box.com/reference#file-object)) |  | Callback function for when an item is renamed. |
| onSelect | function(Array&lt;[Folder](https://developer.box.com/reference#folder-object)&#124;[File](https://developer.box.com/reference#file-object)&#124;[Web Link](https://developer.box.com/reference#web-link-object)&gt;) |  | Callback function for when item(s) are selected. |
| onUpload | function(Array&lt;[File](https://developer.box.com/reference#file-object)&gt;) |  | Callback function for when item(s) are uploaded. |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| rootFolderId | string | `0` | The root folder for the content explorer. |
| sharedLink | string |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| sharedLinkPassword | string |  | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| sortBy | string | `name` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |
| sortDirection | string | `asc` | *See the [developer docs](https://developer.box.com/guides/embed/ui-elements/explorer/#Options).* |

### Keyboard Shortcuts
*See the [developer docs](https://developer.box.com/docs/box-content-explorer#section-keyboard-shortcuts).*

