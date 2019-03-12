**Badge icons**

```jsx
const IconsExample = require('../../../examples/src/IconsExample').default;

const icons = [
    {
        name: 'CoauthoringBadge',
        component: require('./CoauthoringBadge').default,
    },
    {
        name: 'CollaborationBadge',
        component: require('./CollaborationBadge').default,
    },
    {
        name: 'ExpirationBadge',
        component: require('./ExpirationBadge').default,
    },
    {
        name: 'InfoBadge',
        component: require('./InfoBadge').default,
    },
    {
        name: 'LockBadge',
        component: require('./LockBadge').default,
    },
    {
        name: 'MetadataActiveBadge',
        component: require('./MetadataActiveBadge').default,
    },
    {
        name: 'MetadataDefaultBadge',
        component: require('./MetadataDefaultBadge').default,
    },
    {
        name: 'MetadataSharedBadge',
        component: require('./MetadataSharedBadge').default,
    },
    {
        name: 'QuarantineBadge',
        component: require('./QuarantineBadge').default,
    },
    {
        name: 'SharedLinkBadge',
        component: require('./SharedLinkBadge').default,
    },
];

<IconsExample icons={icons} />;
```
