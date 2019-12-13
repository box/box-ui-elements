**File icons**

You can use a file icon directly, or use the higher level FileIcon component to dynamically choose which file icon is displayed based on file extension.

***FileIcon with extension="png"***
```jsx
const FileIcon = require('../file-icon/FileIcon').default;
<FileIcon extension="png" />
```

***FileIcon with extension="pdf"***
```jsx
const FileIcon = require('../file-icon/FileIcon').default;
<FileIcon extension="pdf" />
```

***All available file icons***
```jsx
const IconsExample = require('../../../examples/src/IconsExample').default;

const icons = [
    {
        name: 'FileAudio32',
        component: require('../../icon/content/FileAudio32').default,
    },
    {
        name: 'FileBoxNote32',
        component: require('../../icon/content/FileBoxNote32').default,
    },
    {
        name: 'FileCode32',
        component: require('../../icon/content/FileCode32').default,
    },
    {
        name: 'FileDefault32',
        component: require('../../icon/content/FileDefault32').default,
    },
    {
        name: 'FileDwg32',
        component: require('../../icon/content/FileDwg32').default,
    },
    {
        name: 'FileExcel32',
        component: require('../../icon/content/FileExcel32').default,
    },
    {
        name: 'FileDocs32',
        component: require('../../icon/content/FileDocs32').default,
    },
    {
        name: 'FileSheets32',
        component: require('../../icon/content/FileSheets32').default,
    },
    {
        name: 'FileSlides32',
        component: require('../../icon/content/FileSlides32').default,
    },
    {
        name: 'FileIllustrator32',
        component: require('../../icon/content/FileIllustrator32').default,
    },
    {
        name: 'FileImage32',
        component: require('../../icon/content/FileImage32').default,
    },
    {
        name: 'FileIndesign32',
        component: require('../../icon/content/FileIndesign32').default,
    },
    {
        name: 'FileKeynote32',
        component: require('../../icon/content/FileKeynote32').default,
    },
    {
        name: 'FileNumbers32',
        component: require('../../icon/content/FileNumbers32').default,
    },
    {
        name: 'FilePages32',
        component: require('../../icon/content/FilePages32').default,
    },
    {
        name: 'FilePdf32',
        component: require('../../icon/content/FilePdf32').default,
    },
    {
        name: 'FilePhotoshop32',
        component: require('../../icon/content/FilePhotoshop32').default,
    },
    {
        name: 'FilePowerpoint32',
        component: require('../../icon/content/FilePowerpoint32').default,
    },
    {
        name: 'FilePresentation32',
        component: require('../../icon/content/FilePresentation32').default,
    },
    {
        name: 'FileSpreadsheet32',
        component: require('../../icon/content/FileSpreadsheet32').default,
    },
    {
        name: 'FileText32',
        component: require('../../icon/content/FileText32').default,
    },
    {
        name: 'FileThreeD32',
        component: require('../../icon/content/FileThreeD32').default,
    },
    {
        name: 'FileVector32',
        component: require('../../icon/content/FileVector32').default,
    },
    {
        name: 'FileVideo32',
        component: require('../../icon/content/FileVideo32').default,
    },
    {
        name: 'FileWord32',
        component: require('../../icon/content/FileWord32').default,
    },
    {
        name: 'FileZip32',
        component: require('../../icon/content/FileZip32').default,
    },
];

<IconsExample icons={icons} />;
```
