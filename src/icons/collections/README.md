**Collections icons**

```jsx
const IconsExample = require('../../../examples/src/IconsExample').default;
const IconCollections = require('./IconCollections').default;
const IconCollectionsFilled = require('./IconCollectionsFilled').default;
const IconCollectionsAdd = require('./IconCollectionsAdd').default;
const IconCollectionsStar = require('./IconCollectionsStar').default;
const IconCollectionsStarFilled = require('./IconCollectionsStarFilled').default;
const IconCollectionsBolt = require('./IconCollectionsBolt').default;

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
    {
        name: 'IconCollectionsStar',
        component: IconCollectionsStar,
    },
    {
        name: 'IconCollectionsStarFilled',
        component: IconCollectionsStarFilled,
    },
    {
        name: 'IconCollectionsBolt',
        component: IconCollectionsBolt,
    },
];

<IconsExample icons={icons} />
```
