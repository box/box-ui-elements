**Collections icons**

```jsx
const IconsExample = require('../../../examples/src/IconsExample').default;

const icons = [
    {
        name: 'IconCollections',
        component: require('./IconCollections').default,
    },
    {
        name: 'IconCollectionsFilled',
        component: require('./IconCollectionsFilled').default,
    },
    {
        name: 'IconCollectionsAdd',
        component: require('./IconCollectionsAdd').default,
    },
];

<IconsExample icons={icons} />;
```
