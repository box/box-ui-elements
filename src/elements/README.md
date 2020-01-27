## Authentication
The Box UI Elements are designed to be agnostic of authentication type. They can be used for users with Box accounts (Managed Users) or those without (App Users), and only expect an access token to be passed in for authentication. The [developer documentation](https://developer.box.com/docs/box-ui-elements) contains more information on how to generate and use these access tokens.

## Internationalization (i18n)
The UI Elements use [react-intl](https://github.com/yahoo/react-intl) for internationalization. In order for the UI Elements to render properly, they need to be wrapped in an [IntlProvider](https://github.com/yahoo/react-intl/wiki/Components#intlprovider) context and given a locale and translated messages to use. Each of the UI Element components optionally take in a `language` property and a `messages` property which is then delegated to our internal [IntlProvider](src/components/Internationalize.js). If either of these properties are not passed in, we do not use our internal `IntlProvider` and it is assumed that the parent react app (the react app that is importing in the UI Elements) has its own `IntlProvider`.

The `language` property is a string that can be one of `en-AU`, `en-CA`, `en-GB`, `en-US`, `bn-IN`, `da-DK`, `de-DE`, `es-419`, `es-ES`, `fi-FI`, `fr-CA`, `fr-FR`, `hi-IN`, `it-IT`, `ja-JP`, `ko-KR`, `nb-NO`, `nl-NL`, `pl-PL`, `pt-BR`, `ru-RU`, `sv-SE`, `tr-TR`, `zh-CN`, `zh-TW`.

The `messages` property is a map of message keys and translated strings. All the messages that the UI elements use can be found under the [i18n](i18n) folder. We distribute them as JS modules within the `box-ui-elements` npm package and they can be imported like any other module. We provide translated strings for all the langauges listed above.
