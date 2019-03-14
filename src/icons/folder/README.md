**Folder icons**

You can use a folder icon directly, or use the higher level FolderIcon component to dynamically choose which folder icon is displayed based on whether the folder is collaborated or external.

***FolderIcon with isCollab=true***
```jsx
const FolderIcon = require('../folder-icon/FolderIcon').default;
<FolderIcon isCollab />
```

***FolderIcon with isExternal=true***
```jsx
const FolderIcon = require('../folder-icon/FolderIcon').default;
<FolderIcon isExternal />
```

***All available folder icons***
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
