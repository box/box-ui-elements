**Metadata view icons**

```jsx
const IconsExample = require('../../../examples/src/IconsExample').default;

const icons = [
    {
        name: 'IconMetadataColumns',
        component: require('./IconMetadataColumns').default,
    },
    {
        name: 'IconMetadataFilter',
        component: require('./IconMetadataFilter').default,
    },
    {
        name: 'IconMetadataSwitch',
        component: require('./IconMetadataSwitch').default,
    },
    {
        name: 'IconMetadataView',
        component: require('./IconMetadataView').default,
    },
];

<IconsExample icons={icons} />;
```
