// @flow
import * as React from 'react';

import IconFileAudio from '../file/IconFileAudio';
import IconFileBoxNote from '../file/IconFileBoxNote';
import IconFileCode from '../file/IconFileCode';
import IconFileDefault from '../file/IconFileDefault';
import IconFileDocument from '../file/IconFileDocument';
import IconFileDwg from '../file/IconFileDwg';
import IconFileExcelSpreadsheet from '../file/IconFileExcelSpreadsheet';
import IconFileGoogleDocs from '../file/IconFileGoogleDocs';
import IconFileGoogleSheets from '../file/IconFileGoogleSheets';
import IconFileGoogleSlides from '../file/IconFileGoogleSlides';
import IconFileIllustrator from '../file/IconFileIllustrator';
import IconFileImage from '../file/IconFileImage';
import IconFileIndesign from '../file/IconFileIndesign';
import IconFileKeynote from '../file/IconFileKeynote';
import IconFileNumbers from '../file/IconFileNumbers';
import IconFilePages from '../file/IconFilePages';
import IconFilePDF from '../file/IconFilePDF';
import IconFilePhotoshop from '../file/IconFilePhotoshop';
import IconFilePowerpointPresentation from '../file/IconFilePowerpointPresentation';
import IconFilePresentation from '../file/IconFilePresentation';
import IconFileSpreadsheet from '../file/IconFileSpreadsheet';
import IconFileText from '../file/IconFileText';
import IconFileThreeD from '../file/IconFileThreeD';
import IconFileVector from '../file/IconFileVector';
import IconFileVideo from '../file/IconFileVideo';
import IconFileWordDocument from '../file/IconFileWordDocument';
import IconFileZip from '../file/IconFileZip';

const Components = {
    IconFileAudio,
    IconFileBoxNote,
    IconFileCode,
    IconFileDefault,
    IconFileDocument,
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
