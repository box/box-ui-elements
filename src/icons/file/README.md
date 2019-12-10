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
        component: require('../../icon/content/FileAudio32').default,
    },
    {
        name: 'IconFileBoxNote',
        component: require('../../icon/content/FileBoxNote32').default,
    },
    {
        name: 'IconFileCode',
        component: require('../../icon/content/FileCode32').default,
    },
    {
        name: 'IconFileDefault',
        component: require('../../icon/content/FileDefault32').default,
    },
    {
        name: 'IconFileDwg',
        component: require('../../icon/content/FileDwg32').default,
    },
    {
        name: 'IconFileExcelSpreadsheet',
        component: require('../../icon/content/FileExcel32').default,
    },
    {
        name: 'IconFileGoogleDocs',
        component: require('../../icon/content/FileDocs32').default,
    },
    {
        name: 'IconFileGoogleSheets',
        component: require('../../icon/content/FileSheets32').default,
    },
    {
        name: 'IconFileGoogleSlides',
        component: require('../../icon/content/FileSlides32').default,
    },
    {
        name: 'IconFileIllustrator',
        component: require('../../icon/content/FileIllustrator32').default,
    },
    {
        name: 'IconFileImage',
        component: require('../../icon/content/FileImage32').default,
    },
    {
        name: 'IconFileIndesign',
        component: require('../../icon/content/FileIndesign32').default,
    },
    {
        name: 'IconFileKeynote',
        component: require('../../icon/content/FileKeynote32').default,
    },
    {
        name: 'IconFileNumbers',
        component: require('../../icon/content/FileNumbers32').default,
    },
    {
        name: 'IconFilePages',
        component: require('../../icon/content/FilePages32').default,
    },
    {
        name: 'IconFilePDF',
        component: require('../../icon/content/FilePdf32').default,
    },
    {
        name: 'IconFilePhotoshop',
        component: require('../../icon/content/FilePhotoshop32').default,
    },
    {
        name: 'IconFilePowerpointPresentation',
        component: require('../../icon/content/FilePowerpoint32').default,
    },
    {
        name: 'IconFilePresentation',
        component: require('../../icon/content/FilePresentation32').default,
    },
    {
        name: 'IconFileSpreadsheet',
        component: require('../../icon/content/FileSpreadsheet32').default,
    },
    {
        name: 'IconFileText',
        component: require('../../icon/content/FileText32').default,
    },
    {
        name: 'IconFileThreeD',
        component: require('../../icon/content/FileThreeD32').default,
    },
    {
        name: 'IconFileVector',
        component: require('../../icon/content/FileVector32').default,
    },
    {
        name: 'IconFileVideo',
        component: require('../../icon/content/FileVideo32').default,
    },
    {
        name: 'IconFileWordDocument',
        component: require('../../icon/content/FileWord32').default,
    },
    {
        name: 'IconFileZip',
        component: require('../../icon/content/FileZip32').default,
    },
];

<IconsExample icons={icons} />;
```
