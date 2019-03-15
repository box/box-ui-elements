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
        component: require('./IconFileAudio').default,
    },
    {
        name: 'IconFileBoxNote',
        component: require('./IconFileBoxNote').default,
    },
    {
        name: 'IconFileCode',
        component: require('./IconFileCode').default,
    },
    {
        name: 'IconFileDefault',
        component: require('./IconFileDefault').default,
    },
    {
        name: 'IconFileDocument',
        component: require('./IconFileDocument').default,
    },
    {
        name: 'IconFileDwg',
        component: require('./IconFileDwg').default,
    },
    {
        name: 'IconFileExcelSpreadsheet',
        component: require('./IconFileExcelSpreadsheet').default,
    },
    {
        name: 'IconFileGoogleDocs',
        component: require('./IconFileGoogleDocs').default,
    },
    {
        name: 'IconFileGoogleSheets',
        component: require('./IconFileGoogleSheets').default,
    },
    {
        name: 'IconFileGoogleSlides',
        component: require('./IconFileGoogleSlides').default,
    },
    {
        name: 'IconFileIllustrator',
        component: require('./IconFileIllustrator').default,
    },
    {
        name: 'IconFileImage',
        component: require('./IconFileImage').default,
    },
    {
        name: 'IconFileIndesign',
        component: require('./IconFileIndesign').default,
    },
    {
        name: 'IconFileKeynote',
        component: require('./IconFileKeynote').default,
    },
    {
        name: 'IconFileNumbers',
        component: require('./IconFileNumbers').default,
    },
    {
        name: 'IconFilePages',
        component: require('./IconFilePages').default,
    },
    {
        name: 'IconFilePDF',
        component: require('./IconFilePDF').default,
    },
    {
        name: 'IconFilePhotoshop',
        component: require('./IconFilePhotoshop').default,
    },
    {
        name: 'IconFilePowerpointPresentation',
        component: require('./IconFilePowerpointPresentation').default,
    },
    {
        name: 'IconFilePresentation',
        component: require('./IconFilePresentation').default,
    },
    {
        name: 'IconFileSpreadsheet',
        component: require('./IconFileSpreadsheet').default,
    },
    {
        name: 'IconFileText',
        component: require('./IconFileText').default,
    },
    {
        name: 'IconFileThreeD',
        component: require('./IconFileThreeD').default,
    },
    {
        name: 'IconFileVector',
        component: require('./IconFileVector').default,
    },
    {
        name: 'IconFileVideo',
        component: require('./IconFileVideo').default,
    },
    {
        name: 'IconFileWordDocument',
        component: require('./IconFileWordDocument').default,
    },
    {
        name: 'IconFileZip',
        component: require('./IconFileZip').default,
    },
];

<IconsExample icons={icons} />;
```
