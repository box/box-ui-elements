### Demo ([Documentation](https://developer.box.com/docs/box-content-open-with))
**Note:** The Open With UI Element works only with server generated [app user tokens](https://developer.box.com/docs/work-with-users#section-creating-a-new-app-user-jwt-applications-only-).
For more information on this element, see this [documentation](https://developer.box.com/docs/box-content-open-with).

```jsx
var ContentOpenWith = require('./ContentOpenWith').default;

<IntlProvider locale="en">
    <ContentOpenWith
        features={FEATURES}
        fileId={FILE_ID}
        token={TOKEN}
    />
</IntlProvider>
```

### Screenshot
<img src="https://cdn-images-1.medium.com/max/1600/1*dd2YfUFtbt9z6Lrv6hNF_g.gif" style="border: 1px solid #e8e8e8" width="600" />
---

### Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| fileId* | string | | The id of the file to preview. |
| token* | string |  | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| boxToolsInstallUrl | string | Box's install instructions | This URL will be used instead of the default Box installation instructions which are linked in the _Install Box Tools to open this file on your desktop_ message. |
| boxToolsName | string | _Box Tools_ | This string will replace the name of Box Tools in the _Install Box Tools to open this file on your desktop_ message. |
| dropdownAlignment | string | _left_ or _right_ | Determines the dropdown's alignment to the Open With button. |
| language | string | `en-US` | *See the [Internationalization](../README.md#internationalization) section* |
| messages | Map<string, string> |  | *See the [Internationalization](../README.md#internationalization) section* |
| onExecute | Function | | A callback that executes when an integration invocation is attempted. |
| requestInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |
| responseInterceptor | function | | *See the [developer docs](https://developer.box.com/docs/box-content-sidebar#section-options).* |

