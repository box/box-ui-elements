`import ContentSidebar from 'box-ui-elements/es/elements/content-sidebar';`

### Screenshot

## <img src="https://user-images.githubusercontent.com/1075325/50999865-3707d200-14e0-11e9-8488-81a4e2a5fe43.png" width="400" />

[Documentation](https://developer.box.com/docs/box-content-sidebar)

### Props

| Prop                 | Type                 | Default | Description                                                                                     |
| -------------------- | -------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| fileId\*             | string               |         | The id of the file to preview.                                                                  |
| token\*              | string               |         | _See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options)._ |
| activitySidebarProps | ActivitySidebarProps | `{}`    | _See below_                                                                                     |
| detailsSidebarProps  | DetailsSidebarProps  | `{}`    | _See below_                                                                                     |
| hasActivityFeed      | boolean              | `false` | _See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options)._ |
| hasMetadata          | boolean              | `false` | _See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options)._ |
| hasSkills            | boolean              | `false` | _See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options)._ |
| hasVersions          | boolean              | `false` | _See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options)._ |
| language             | string               | `en-US` | _See the [Internationalization](../README.md#internationalization) section_                     |
| messages             | Map<string, string>  |         | _See the [Internationalization](../README.md#internationalization) section_                     |
| metadataSidebarProps | MetadataSidebarProps | `{}`    | _See below_                                                                                     |
| requestInterceptor   | function             |         | _See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options)._ |
| responseInterceptor  | function             |         | _See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options)._ |
| skillsSidebarProps   | SkillsSidebarProps   | `{}`    | _See below_                                                                                     |

#### ActivitySidebarProps

| Prop            | Type     | Default | Description                                                                                                  |
| --------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| onCommentCreate | function |         | _See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-activitySidebarProps)._ |
| onCommentDelete | function |         | _See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-activitySidebarProps)._ |

#### DetailsSidebarProps

| Prop           | Type    | Default | Description                                                                                                 |
| -------------- | ------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| hasAccessStats | boolean | `false` | _See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-detailssidebarprops)._ |
| hasNotices     | boolean | `false` | _See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-detailssidebarprops)._ |
| hasProperties  | boolean | `false` | _See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-detailssidebarprops)._ |

#### MetadataSidebarProps

| Prop                | Type            | Default | Description                                                          |
| ------------------- | --------------- | ------- | -------------------------------------------------------------------- |
| selectedTemplateKey | `string`        |         | `templateKey` for the template to show. If provided,                 |
|                     |                 |         | no other templates will be visible.                                  |
| templateFilters     | `Array<string>` |         | Template field IDs for fields that should be visible and editable.   |
|                     | or `string`     |         | To show a single field, pass the ID as a string; to show multiple    |
|                     |                 |         | fields, pass an array of IDs as strings. If no `templateFilters` are |
|                     |                 |         | provided, then all fields will be visible and editable.              |

#### SkillsSidebarProps

| Prop  | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| _tbd_ | -    | -       | -           |
