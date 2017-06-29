/**
 * @flow
 * @file Determines the file icon
 * @author Box
 */

import React from 'react';
import {
    IconFileAudio,
    IconFileBookmark,
    IconFileBoxNote,
    IconFileCode,
    IconFileDefault,
    IconFileDocument,
    IconFileIllustrator,
    IconFileImage,
    IconFileIndesign,
    IconFilePDF,
    IconFilePhotoshop,
    IconFilePresentation,
    IconFileSpreadsheet,
    IconFileText,
    IconFileThreeD,
    IconFileVector,
    IconFileVideo,
    IconFileZip
} from './';

const Components = {
    IconFileAudio,
    IconFileBookmark,
    IconFileBoxNote,
    IconFileCode,
    IconFileDefault,
    IconFileDocument,
    IconFileIllustrator,
    IconFileImage,
    IconFileIndesign,
    IconFilePDF,
    IconFilePhotoshop,
    IconFilePresentation,
    IconFileSpreadsheet,
    IconFileText,
    IconFileThreeD,
    IconFileVector,
    IconFileVideo,
    IconFileZip
};

type Props = {
    extension: string,
    dimension: number
};

const mirror = (values): Object =>
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
        'wpl'
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
        'yaml'
    ]),
    IconFileDocument: mirror([
        'csv',
        'doc',
        'docx',
        'dot',
        'dotx',
        'gdoc',
        'msg',
        'odt',
        'rtf',
        'tsv',
        'wpd',
        'xhtml',
        'xml',
        'xsd',
        'xsl'
    ]),
    IconFileVector: mirror(['eps']),
    IconFileIllustrator: mirror(['svg', 'ai']),
    IconFileIndesign: mirror(['indd']),
    IconFileImage: mirror([
        'bmp',
        'gif',
        'eps',
        'gdraw',
        'jpeg',
        'jpg',
        'png',
        'ps',
        'svs',
        'tif',
        'tiff',
        'ai',
        'eps',
        'ps'
    ]),
    IconFileBookmark: mirror(['link']),
    IconFilePDF: mirror(['pdf']),
    IconFilePresentation: mirror(['gslide', 'key', 'odp', 'otp', 'pot', 'potx', 'ppt', 'pptx']),
    IconFilePhotoshop: mirror(['psd']),
    IconFileSpreadsheet: mirror(['gsheet', 'ods', 'xls', 'xlsm', 'xlsx', 'xlt', 'xltx']),
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
        'wmv'
    ]),
    IconFileZip: mirror(['rar', 'tgz', 'zip'])
};

const getFileIconComponent = (extension): string => {
    const extensionComponentName = Object.keys(EXTENSIONS).filter(
        (extensionComponent) => !!EXTENSIONS[extensionComponent][extension]
    )[0];
    return extensionComponentName || 'IconFileDefault';
};

const FileIcon = ({ extension = '', dimension = 32 }: Props) => {
    const IconComponent = Components[getFileIconComponent(extension)];
    return <IconComponent height={dimension} width={dimension} />;
};

export default FileIcon;
