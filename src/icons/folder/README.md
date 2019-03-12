**Folder icons**

```jsx
const IconsExample = require('../../../examples/src/IconsExample').default;

const icons = [
    {
        name: 'IconFolderCollab',
        component: require('./IconFolderCollab').default,
    },
    {
        name: 'IconFolderExternal',
        component: require('./IconFolderExternal').default,
    },
    {
        name: 'IconFolderPersonal',
        component: require('./IconFolderPersonal').default,
    },
    {
        name: 'IconSmallFolder',
        component: require('./IconSmallFolder').default,
    },
];

<IconsExample icons={icons} />;
```
