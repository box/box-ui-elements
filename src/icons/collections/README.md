**Collections icons**

```jsx
const IconsExample = require('../../../examples/src/IconsExample').default;
const IconCollections = require('./IconCollections').default;
const IconCollectionsFilled = require('./IconCollectionsFilled').default;
const IconCollectionsAdd = require('./IconCollectionsAdd').default;

const icons = [
    {
        name: 'IconCollections',
        component: IconCollections,
    },
    {
        name: 'IconCollectionsFilled',
        component: IconCollectionsFilled,
    },
    {
        name: 'IconCollectionsAdd',
        component: IconCollectionsAdd,
    },
];

<IconsExample icons={icons} />
```
