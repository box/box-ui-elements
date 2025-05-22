import * as React from 'react';
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

import {
    FileAdobeExpress,
    FileAudio,
    FileBookmark,
    FileBoxNote,
    FileCanvas,
    FileCode,
    FileDefault,
    FileDicom,
    FileDocGen,
    FileDocs,
    FileDwg,
    FileExcel,
    FileIllustrator,
    FileImage,
    FileIndesign,
    FileKeynote,
    FileNumbers,
    FilePdf,
    FilePages,
    FilePhotoshop,
    FilePowerpoint,
    FilePresentation,
    FileSheets,
    FileSlides,
    FileSpreadsheet,
    FileText,
    FileThreeD,
    FileUpload,
    FileVector,
    FileVideo,
    FileWord,
    FileXbd,
    FileXdw,
    FileZip,
} from '@box/blueprint-web-assets/icons/Content';
import { useIntl } from 'react-intl';

import messages from '../../elements/common/messages';

type FileIconComponent = ForwardRefExoticComponent<SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>>;

const Components: { [key: string]: FileIconComponent } = {
    FileAdobeExpress,
    FileAudio,
    FileBookmark,
    FileBoxNote,
    FileCanvas,
    FileCode,
    FileDefault,
    FileDicom,
    FileDocGen,
    FileDocument: FileText,
    FileDocs,
    FileDwg,
    FileExcel,
    FileIllustrator,
    FileImage,
    FileIndesign,
    FileKeynote,
    FileNumbers,
    FilePdf,
    FilePages,
    FilePhotoshop,
    FilePowerpoint,
    FilePresentation,
    FileSheets,
    FileSlides,
    FileSpreadsheet,
    FileText,
    FileThreeD,
    FileUpload,
    FileVector,
    FileVideo,
    FileWord,
    FileXbd,
    FileXdw,
    FileZip,
};

const mirror = (values: Array<string>) =>
    values.reduce((prev: { [key: string]: string }, cur: string) => {
        prev[cur] = cur;
        return prev;
    }, {});

export const EXTENSIONS: { [key: string]: { [key: string]: string } } = {
    FileAdobeExpress: mirror(['adobeexpress']),
    FileAudio: mirror([
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
    FileCanvas: mirror(['boxcanvas']),
    FileBoxNote: mirror(['boxnote']),
    FileCode: mirror([
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
    FileDocument: mirror(['dot', 'dotx', 'msg', 'odt', 'rtf', 'wpd', 'xhtml', 'xml', 'xsd', 'xsl']),
    FileDwg: mirror(['dwg', 'dwgzip']),
    FileExcel: mirror(['xls', 'xlsx', 'xlsm', 'xlsb']),
    FileDocs: mirror(['gdoc']),
    FileSheets: mirror(['gsheet']),
    FileSlides: mirror(['gslide', 'gslides']),
    FileVector: mirror(['eps']),
    FileIllustrator: mirror(['ai']),
    FileIndesign: mirror(['idml', 'indd', 'indt', 'inx']),
    FileKeynote: mirror(['key']),
    FileNumbers: mirror(['numbers']),
    FilePages: mirror(['pages']),
    FileImage: mirror(['bmp', 'gif', 'gdraw', 'jpeg', 'jpg', 'png', 'ps', 'svs', 'svg', 'tif', 'tiff', 'heic', 'heif']),
    FilePdf: mirror(['pdf']),
    FilePresentation: mirror(['odp', 'otp', 'pot', 'potx']),
    FilePowerpoint: mirror(['ppt', 'pptx', 'pptm']),
    FilePhotoshop: mirror(['psd']),
    FileSpreadsheet: mirror(['csv', 'ods', 'tsv', 'xlt', 'xltx']),
    FileText: mirror(['txt', 'vi', 'vim', 'webdoc']),
    FileThreeD: mirror(['3ds', 'dae', 'fbx', 'obj', 'ply', 'stl']),
    FileVideo: mirror([
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
    FileWord: mirror(['docx', 'doc', 'docm']),
    FileXbd: mirror(['xbd']),
    FileXdw: mirror(['xdw']),
    FileZip: mirror(['rar', 'tgz', 'zip']),
};

const getFileIconComponent = (extension = '') => {
    const extensionComponentName = Object.keys(EXTENSIONS).filter(
        extensionComponent => !!EXTENSIONS[extensionComponent][extension.toLowerCase()],
    )[0];
    return extensionComponentName || 'FileDefault';
};

export interface FileIconProps {
    /** Dimension of the icon. */
    dimension?: number;
    /** Extension of file to display icon for. Defaults to generic icon */
    extension?: string;
    /** A string describing the icon if it's not purely decorative for accessibility */
    title?: string;
}

const FileIcon = ({ dimension = 32, extension = '', title }: FileIconProps) => {
    const { formatMessage } = useIntl();
    const componentName = getFileIconComponent(extension);
    const IconComponent = Components[componentName];

    return (
        <IconComponent
            aria-label={
                title ||
                (componentName === 'FileDefault'
                    ? formatMessage(messages.file)
                    : formatMessage(messages.iconFile, { extension: extension.toUpperCase() }))
            }
            height={dimension}
            width={dimension}
        />
    );
};

export default FileIcon;
