// @flow
import * as React from 'react';

import IconFileAudio from '../imported/IconFileAudio32';
import IconFileBoxNote from '../imported/IconFileBoxNote32';
import IconFileCode from '../imported/IconFileCode32';
import IconFileDefault from '../imported/IconFileDefault32';
import IconFileDwg from '../imported/IconFileDwg32';
import IconFileExcelSpreadsheet from '../imported/IconFileExcel32';
import IconFileGoogleDocs from '../imported/IconFileDocs32';
import IconFileGoogleSheets from '../imported/IconFileSheets32';
import IconFileGoogleSlides from '../imported/IconFileSlides32';
import IconFileIllustrator from '../imported/IconFileIllustrator32';
import IconFileImage from '../imported/IconFileImage32';
import IconFileIndesign from '../imported/IconFileIndesign32';
import IconFileKeynote from '../imported/IconFileKeynote32';
import IconFileNumbers from '../imported/IconFileNumbers32';
import IconFilePages from '../imported/IconFilePages32';
import IconFilePDF from '../imported/IconFilePdf32';
import IconFilePhotoshop from '../imported/IconFilePhotoshop32';
import IconFilePowerpointPresentation from '../imported/IconFilePowerpoint32';
import IconFilePresentation from '../imported/IconFilePresentation32';
import IconFileSpreadsheet from '../imported/IconFileSpreadsheet32';
import IconFileText from '../imported/IconFileText32';
import IconFileThreeD from '../imported/IconFileThreeD32';
import IconFileVector from '../imported/IconFileVector32';
import IconFileVideo from '../imported/IconFileVideo32';
import IconFileWordDocument from '../imported/IconFileWord32';
import IconFileZip from '../imported/IconFileZip32';

const Components = {
    IconFileAudio,
    IconFileBoxNote,
    IconFileCode,
    IconFileDefault,
    IconFileDocument: IconFileText,
    IconFileDwg,
    IconFileExcelSpreadsheet,
    IconFileGoogleDocs,
    IconFileGoogleSheets,
    IconFileGoogleSlides,
    IconFileIllustrator,
    IconFileImage,
    IconFileIndesign,
    IconFileKeynote,
    IconFileNumbers,
    IconFilePages,
    IconFilePDF,
    IconFilePhotoshop,
    IconFilePowerpointPresentation,
    IconFilePresentation,
    IconFileSpreadsheet,
    IconFileText,
    IconFileThreeD,
    IconFileVector,
    IconFileVideo,
    IconFileWordDocument,
    IconFileZip,
};

const mirror = values =>
    values.reduce((prev, cur) => {
        prev[cur] = cur;
        return prev;
    }, {});

const EXTENSIONS = {
    IconFileAudio: mirror([
        'aac',
        'aif',
        'aifc',
        'aiff',
        'amr',
        'au',
        'flac',
        'm3u',
        'm4a',
        'mid',
        'mp3',
        'ra',
        'wav',
        'wma',
        'wpl',
    ]),
    IconFileBoxNote: mirror(['boxnote']),
    IconFileCode: mirror([
        'as',
        'as3',
        'asm',
        'aspx',
        'c',
        'cpp',
        'bat',
        'c',
        'cc',
        'cmake',
        'cs',
        'css',
        'cxx',
        'db',
        'diff',
        'erb',
        'groovy',
        'h',
        'haml',
        'hh',
        'htm',
        'html',
        'java',
        'js',
        'less',
        'm',
        'make',
        'md',
        'ml',
        'mm',
        'php',
        'pl',
        'plist',
        'properties',
        'py',
        'rb',
        'sass',
        'scala',
        'script',
        'scm',
        'sml',
        'sql',
        'sh',
        'wabba',
        'yaml',
    ]),
    IconFileDocument: mirror(['csv', 'dot', 'dotx', 'msg', 'odt', 'rtf', 'tsv', 'wpd', 'xhtml', 'xml', 'xsd', 'xsl']),
    IconFileDwg: mirror(['dwg', 'dwgzip']),
    IconFileExcelSpreadsheet: mirror(['xls', 'xlsx', 'xlsm', 'xlsb']),
    IconFileGoogleDocs: mirror(['gdoc']),
    IconFileGoogleSheets: mirror(['gsheet']),
    IconFileGoogleSlides: mirror(['gslide', 'gslides']),
    IconFileVector: mirror(['eps']),
    IconFileIllustrator: mirror(['ai']),
    IconFileIndesign: mirror(['indd']),
    IconFileKeynote: mirror(['key']),
    IconFileNumbers: mirror(['numbers']),
    IconFilePages: mirror(['pages']),
    IconFileImage: mirror(['bmp', 'gif', 'gdraw', 'jpeg', 'jpg', 'png', 'ps', 'svs', 'svg', 'tif', 'tiff']),
    IconFilePDF: mirror(['pdf']),
    IconFilePresentation: mirror(['odp', 'otp', 'pot', 'potx']),
    IconFilePowerpointPresentation: mirror(['ppt', 'pptx', 'pptm']),
    IconFilePhotoshop: mirror(['psd']),
    IconFileSpreadsheet: mirror(['ods', 'xlt', 'xltx']),
    IconFileText: mirror(['txt', 'vi', 'vim', 'webdoc']),
    IconFileThreeD: mirror(['3ds', 'dae', 'fbx', 'obj', 'ply', 'stl']),
    IconFileVideo: mirror([
        '3g2',
        '3gp',
        'avi',
        'flv',
        'm2v',
        'm2ts',
        'm4v',
        'mkv',
        'mov',
        'mp4',
        'mpeg',
        'mpg',
        'ogg',
        'mts',
        'qt',
        'wmv',
    ]),
    IconFileWordDocument: mirror(['docx', 'doc', 'docm']),
    IconFileZip: mirror(['rar', 'tgz', 'zip']),
};

const getFileIconComponent = extension => {
    const extensionComponentName = Object.keys(EXTENSIONS).filter(
        extensionComponent => !!EXTENSIONS[extensionComponent][extension],
    )[0];
    return extensionComponentName || 'IconFileDefault';
};

type Props = {
    /** Dimension of the icon. */
    dimension?: number,
    /** Extension of file to display icon for. Defaults to generic icon */
    extension?: string,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
};

const FileIcon = ({ dimension = 32, extension = '', title }: Props) => {
    const IconComponent = Components[getFileIconComponent(extension)];
    return <IconComponent height={dimension} title={title} width={dimension} />;
};

export default FileIcon;
