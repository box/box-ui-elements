## Authentication
The Box UI Elements are designed to be agnostic of authentication type. They can be used for users with Box accounts (Managed Users) or those without (App Users), and only expect an access token to be passed in for authentication. The [developer documentation](https://developer.box.com/docs/box-ui-elements) contains more information on how to generate and use these access tokens.

## Internationalization (i18n)
The UI Elements use [react-intl](https://github.com/yahoo/react-intl) for internationalization. In order for the UI Elements to render properly, they need to be wrapped in an [IntlProvider](https://github.com/yahoo/react-intl/wiki/Components#intlprovider) context and given a locale and translated messages to use. Each of the UI Element components optionally take in a `language` property and a `messages` property which is then delegated to our internal [IntlProvider](src/components/Internationalize.js). If either of these properties are not passed in, we do not use our internal `IntlProvider` and it is assumed that the parent react app (the react app that is importing in the UI Elements) has its own `IntlProvider`.

The `language` property is a string that can be one of `en-AU`, `en-CA`, `en-GB`, `en-US`, `bn-IN`, `da-DK`, `de-DE`, `es-419`, `es-ES`, `fi-FI`, `fr-CA`, `fr-FR`, `hi-IN`, `it-IT`, `ja-JP`, `ko-KR`, `nb-NO`, `nl-NL`, `pl-PL`, `pt-BR`, `ru-RU`, `sv-SE`, `tr-TR`, `zh-CN`, `zh-TW`.

The `messages` property is a map of message keys and translated strings. All the messages that the UI elements use can be found under the [i18n](i18n) folder. We distribute them as JS modules within the `box-ui-elements` npm package and they can be imported like any other module. We provide translated strings for all the langauges listed above.

For `react-intl` to work properly, locale data needs to be added via [addlocaledata](https://github.com/yahoo/react-intl/wiki/API#addlocaledata). They are all bundled inside the `react-intl` package inside `node_modules`. By default it uses the `en` locale but for any other locale you have to do similar to the following before rendering the component:
```js static
import { addLocaleData } from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';
addLocaleData(frLocaleData);
```

The messages that are needed for the components can be imported from `box-ui-elements/i18n/[LANGUAGE]` package under `node_modules`. The code examples for each of the UI Elements assume `en-US` and show how the US english messages are imported in.
