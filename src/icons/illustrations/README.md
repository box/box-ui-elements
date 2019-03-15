**Illustration icons**

```jsx
const IconsExample = require('../../../examples/src/IconsExample').default;

const icons = [
    {
        name: 'AcrossDevicesIllustration',
        component: require('./AcrossDevicesIllustration').default,
    },
    {
        name: 'BoxDriveSyncIllustration',
        component: require('./BoxDriveSyncIllustration').default,
    },
    {
        name: 'ChartCircleIllustration',
        component: require('./ChartCircleIllustration').default,
    },
    {
        name: 'CloudFileLaptopIllustration',
        component: require('./CloudFileLaptopIllustration').default,
    },
    {
        name: 'FileCircleIllustration',
        component: require('./FileCircleIllustration').default,
    },
    {
        name: 'FolderCircleIllustration',
        component: require('./FolderCircleIllustration').default,
    },
    {
        name: 'PeopleOpeningEnvelopeIllustration',
        component: require('./PeopleOpeningEnvelopeIllustration').default,
    },
];

<IconsExample icons={icons} />;
```
