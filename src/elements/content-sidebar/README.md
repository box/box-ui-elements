### Demo ([Documentation](https://developer.box.com/docs/box-content-sidebar))
```jsx
var ContentSidebar = require('./ContentSidebar').default;

<IntlProvider locale="en" textComponent={React.Fragment}>
    <ContentSidebar
        detailsSidebarProps={{
            hasProperties: true,
            hasNotices: true,
            hasAccessStats: true,
            hasClassification: true,
            hasRetentionPolicy: true,
            hasVersions: true,
        }}
        features={FEATURES}
        fileId={FILE_ID}
        hasActivityFeed
        hasMetadata
        hasSkills
        token={TOKEN}
    />
</IntlProvider>
```

### Screenshot
<img src="https://user-images.githubusercontent.com/1075325/50999865-3707d200-14e0-11e9-8488-81a4e2a5fe43.png" width="400" />
---

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| fileId* | string | | The id of the file to preview. |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| activitySidebarProps | ActivitySidebarProps | `{}` | *See below* |
| detailsSidebarProps | DetailsSidebarProps | `{}` | *See below* |
| hasActivityFeed | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| hasMetadata | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| hasSkills | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| language | string | `en-US` | *See the [Internationalization](../README.md#internationalization) section* |
| messages | Map<string, string> |  | *See the [Internationalization](../README.md#internationalization) section* |
| metadataSidebarProps | MetadataSidebarProps | `{}` | *See below* |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| skillsSidebarProps | SkillsSidebarProps | `{}` | *See below* |

#### ActivitySidebarProps
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| onCommentCreate | function | | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-activitySidebarProps).* |
| onCommentDelete | function | | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-activitySidebarProps).* |

#### DetailsSidebarProps
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| hasAccessStats | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-detailssidebarprops).* |
| hasNotices | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-detailssidebarprops).* |
| hasProperties | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-detailssidebarprops).* |
| hasVersions | boolean | `false` | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-detailssidebarprops).* |

#### MetadataSidebarProps
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| *tbd* | - | - | - |

#### SkillsSidebarProps
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| *tbd* | - | - | - |
