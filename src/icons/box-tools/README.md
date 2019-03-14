**Box Tools icons**

```jsx
const IconsExample = require('../../../examples/src/IconsExample').default;

const icons = [
    {
        name: 'IconBoxToolsDownload',
        component: require('./IconBoxToolsDownload').default,
    },
    {
        name: 'IconBoxToolsInstall',
        component: require('./IconBoxToolsInstall').default,
    },
    {
        name: 'IconBoxToolsUpgradeBrowser',
        component: require('./IconBoxToolsUpgradeBrowser').default,
    },
];

<IconsExample icons={icons} />;
```
