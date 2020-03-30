## Authentication
The Box UI Elements are designed to be agnostic of the authentication type. They can be used for users with Box accounts (Managed Users) or those without (App Users), and only expect an access token to be passed in for authentication. The [developer documentation](https://developer.box.com/docs/box-ui-elements) contains more information on how to generate and use these access tokens.

## Internationalization (i18n)
The UI Elements use [react-intl](https://github.com/formatjs/react-intl) for internationalization. In order for the UI Elements to render properly, they need to be wrapped in an i18n context via the [IntlProvider](https://github.com/formatjs/react-intl/blob/master/docs/Getting-Started.md#creating-an-i18n-context) and given a locale and translated messages to use. Each of the UI Element components optionally take in a `language` property and a `messages` property which is then delegated to our internal [IntlProvider](src/components/Internationalize.js). If either of these properties are not passed in, we do not use our internal `IntlProvider` and it is assumed that the parent react app (the react app that is importing in the UI Elements) has its own `IntlProvider`.

The `language` property is a string that can be one of `en-AU`, `en-CA`, `en-GB`, `en-US`, `bn-IN`, `da-DK`, `de-DE`, `es-419`, `es-ES`, `fi-FI`, `fr-CA`, `fr-FR`, `hi-IN`, `it-IT`, `ja-JP`, `ko-KR`, `nb-NO`, `nl-NL`, `pl-PL`, `pt-BR`, `ru-RU`, `sv-SE`, `tr-TR`, `zh-CN`, `zh-TW`.

The `messages` property is a map of message keys and translated strings. All the messages that the UI elements use can be found under the [i18n](i18n) folder. We distribute them as JS modules within the `box-ui-elements` npm package and they can be imported like any other module - `import box-ui-elements/i18n/[LANGUAGE FROM ABOVE]`. The code examples for each of the UI Elements assume `en-US` and show how the US english messages are imported in.

For `react-intl` to work properly, please look at its [requirements](https://github.com/formatjs/react-intl/blob/master/docs/Getting-Started.md#runtime-requirements). You may need to polyfill [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) if you are supporting older browsers. One approach can be to import polyfills within your own application via:

```js static
import '@formatjs/intl-pluralrules/dist-es6/polyfill';
import '@formatjs/intl-relativetimeformat/dist-es6/polyfill';
```


