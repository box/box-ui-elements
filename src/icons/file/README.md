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
        name: 'IconFileAudio',
        component: require('../imported/IconFileAudio32').default,
    },
    {
        name: 'IconFileBoxNote',
        component: require('../imported/IconFileBoxNote32').default,
    },
    {
        name: 'IconFileCode',
        component: require('../imported/IconFileCode32').default,
    },
    {
        name: 'IconFileDefault',
        component: require('../imported/IconFileDefault32').default,
    },
    {
        name: 'IconFileDwg',
        component: require('../imported/IconFileDwg32').default,
    },
    {
        name: 'IconFileExcelSpreadsheet',
        component: require('../imported/IconFileExcel32').default,
    },
    {
        name: 'IconFileGoogleDocs',
        component: require('../imported/IconFileDocs32').default,
    },
    {
        name: 'IconFileGoogleSheets',
        component: require('../imported/IconFileSheets32').default,
    },
    {
        name: 'IconFileGoogleSlides',
        component: require('../imported/IconFileSlides32').default,
    },
    {
        name: 'IconFileIllustrator',
        component: require('../imported/IconFileIllustrator32').default,
    },
    {
        name: 'IconFileImage',
        component: require('../imported/IconFileImage32').default,
    },
    {
        name: 'IconFileIndesign',
        component: require('../imported/IconFileIndesign32').default,
    },
    {
        name: 'IconFileKeynote',
        component: require('../imported/IconFileKeynote32').default,
    },
    {
        name: 'IconFileNumbers',
        component: require('../imported/IconFileNumbers32').default,
    },
    {
        name: 'IconFilePages',
        component: require('../imported/IconFilePages32').default,
    },
    {
        name: 'IconFilePDF',
        component: require('../imported/IconFilePdf32').default,
    },
    {
        name: 'IconFilePhotoshop',
        component: require('../imported/IconFilePhotoshop32').default,
    },
    {
        name: 'IconFilePowerpointPresentation',
        component: require('../imported/IconFilePowerpoint32').default,
    },
    {
        name: 'IconFilePresentation',
        component: require('../imported/IconFilePresentation32').default,
    },
    {
        name: 'IconFileSpreadsheet',
        component: require('../imported/IconFileSpreadsheet32').default,
    },
    {
        name: 'IconFileText',
        component: require('../imported/IconFileText32').default,
    },
    {
        name: 'IconFileThreeD',
        component: require('../imported/IconFileThreeD32').default,
    },
    {
        name: 'IconFileVector',
        component: require('../imported/IconFileVector32').default,
    },
    {
        name: 'IconFileVideo',
        component: require('../imported/IconFileVideo32').default,
    },
    {
        name: 'IconFileWordDocument',
        component: require('../imported/IconFileWord32').default,
    },
    {
        name: 'IconFileZip',
        component: require('../imported/IconFileZip32').default,
    },
];

<IconsExample icons={icons} />;
```
