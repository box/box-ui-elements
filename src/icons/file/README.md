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
        component: require('../imported/Icon/IconFileAudio32').default,
    },
    {
        name: 'IconFileBoxNote',
        component: require('../imported/Icon/IconFileBoxNote32').default,
    },
    {
        name: 'IconFileCode',
        component: require('../imported/Icon/IconFileCode32').default,
    },
    {
        name: 'IconFileDefault',
        component: require('../imported/Icon/IconFileDefault32').default,
    },
    {
        name: 'IconFileDwg',
        component: require('../imported/Icon/IconFIleDwg32').default,
    },
    {
        name: 'IconFileExcelSpreadsheet',
        component: require('../imported/Icon/IconFileExcel32').default,
    },
    {
        name: 'IconFileGoogleDocs',
        component: require('../imported/Icon/IconFileDocs32').default,
    },
    {
        name: 'IconFileGoogleSheets',
        component: require('../imported/Icon/IconFileSheets32').default,
    },
    {
        name: 'IconFileGoogleSlides',
        component: require('../imported/Icon/IconFileSlides32').default,
    },
    {
        name: 'IconFileIllustrator',
        component: require('../imported/Icon/IconFileIllustrator32').default,
    },
    {
        name: 'IconFileImage',
        component: require('../imported/Icon/IconFileImage32').default,
    },
    {
        name: 'IconFileIndesign',
        component: require('../imported/Icon/IconFileIndesign32').default,
    },
    {
        name: 'IconFileKeynote',
        component: require('../imported/Icon/IconFileKeynote32').default,
    },
    {
        name: 'IconFileNumbers',
        component: require('../imported/Icon/IconFileNumbers32').default,
    },
    {
        name: 'IconFilePages',
        component: require('../imported/Icon/IconFilePages32').default,
    },
    {
        name: 'IconFilePDF',
        component: require('../imported/Icon/IconFilePdf32').default,
    },
    {
        name: 'IconFilePhotoshop',
        component: require('../imported/Icon/IconFilePhotoshop32').default,
    },
    {
        name: 'IconFilePowerpointPresentation',
        component: require('../imported/Icon/IconFilePowerpoint32').default,
    },
    {
        name: 'IconFilePresentation',
        component: require('../imported/Icon/IconFilePresentation32').default,
    },
    {
        name: 'IconFileSpreadsheet',
        component: require('../imported/Icon/IconFileSpreadsheet32').default,
    },
    {
        name: 'IconFileText',
        component: require('../imported/Icon/IconFileText32').default,
    },
    {
        name: 'IconFileThreeD',
        component: require('../imported/Icon/IconFileThreeD32').default,
    },
    {
        name: 'IconFileVector',
        component: require('../imported/Icon/IconFileVector32').default,
    },
    {
        name: 'IconFileVideo',
        component: require('../imported/Icon/IconFileVideo32').default,
    },
    {
        name: 'IconFileWordDocument',
        component: require('../imported/Icon/IconFileWord32').default,
    },
    {
        name: 'IconFileZip',
        component: require('../imported/Icon/IconFileZip32').default,
    },
];

<IconsExample icons={icons} />;
```
