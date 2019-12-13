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
        name: 'FolderShared32',
        component: require('../../icon/content/FolderShared32').default,
    },
    {
        name: 'FolderExternal32',
        component: require('../../icon/content/FolderExternal32').default,
    },
    {
        name: 'FolderPersonal32',
        component: require('../../icon/content/FolderPersonal32').default,
    },
    {
        name: 'IconSmallFolder',
        component: require('./IconSmallFolder').default,
    },
];

<IconsExample icons={icons} />;
```
