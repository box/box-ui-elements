## Authentication
The Box UI Elements are designed to be agnostic of the authentication type. They can be used for users with Box accounts (Managed Users) or those without (App Users), and only expect an access token to be passed in for authentication. The [developer documentation](https://developer.box.com/docs/box-ui-elements) contains more information on how to generate and use these access tokens.

_Note: When you are required to pass an access token to a Box Element Component, keep in mind that you can pass the access token as a string, or as a function. If you pass a function, it should return a string. Whenever the Box Element Component needs to make an API call to Box, it will use the accessToken you supplied, or invoke the access token function to get the access token._

## Internationalization (i18n)
The UI Elements use [react-intl](https://formatjs.io/docs/react-intl/) for internationalization. In order for the UI Elements to render properly, they need to be wrapped in an i18n context via the [IntlProvider](https://github.com/formatjs/formatjs/blob/main/website/docs/react-intl/components.md#intlprovider) and given a locale and translated messages to use. Each of the UI Element components optionally take in a `language` property and a `messages` property which is then delegated to our internal [IntlProvider](src/components/Internationalize.js). If either of these properties are not passed in, we do not use our internal `IntlProvider` and it is assumed that the parent react app (the react app that is importing in the UI Elements) has its own `IntlProvider`.

The `language` property is a string that can be one of `en-AU`, `en-CA`, `en-GB`, `en-US`, `bn-IN`, `da-DK`, `de-DE`, `es-419`, `es-ES`, `fi-FI`, `fr-CA`, `fr-FR`, `hi-IN`, `it-IT`, `ja-JP`, `ko-KR`, `nb-NO`, `nl-NL`, `pl-PL`, `pt-BR`, `ru-RU`, `sv-SE`, `tr-TR`, `zh-CN`, `zh-TW`.

The `messages` property is a map of message keys and translated strings. All the messages that the UI elements use can be found under the [i18n](https://github.com/box/box-ui-elements/tree/master/i18n) folder. We distribute them as JS modules within the `box-ui-elements` npm package and they can be imported like any other module - `import box-ui-elements/i18n/bundles/[LANGUAGE FROM ABOVE]`. The code examples for each of the UI Elements assume `en-US` and show how the US english messages are imported in.

If you are using the CDNs, the i18n messages are included in the bundle.

Example of using the `language` and `messages` properties:
```jsx static
import messages from 'box-ui-elements/i18n/bundles/ja-JP';

<ContentExplorer language="ja-JP" messages={messages} {...PROPS} />
```

_ContentExplorer will show in Japanese._

Example `IntlProvider` with multiple elements
```jsx static
import messages from 'box-ui-elements/i18n/bundles/ja-JP';

<IntlProvider locale="ja-JP" messages={messages}>
    <ContentExplorer {...PROPS} />
    <ContentPicker {...PROPS} />
</IntlProvider>
```

_Both ContentExplorer and ContentPicker will show in Japanese._

Example of using different `language` and `messages` properties:

```jsx static
import jaMessages from 'box-ui-elements/i18n/bundles/ja-JP';
import deMessages from 'box-ui-elements/i18n/bundles/de-DE';

<ContentExplorer language="ja-JP" messages={jaMessages} {...PROPS} />
<ContentPicker language="de-DE" messages={deMessages} {...PROPS} />
```

_ContentExplorer will show in Japanese and ContentPicker will show in German._
