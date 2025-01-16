import * as React from 'react';

import { SVGProps } from '../../components/accessible-svg/AccessibleSVG';

import IconFileAudio from '../../icon/content/FileAudio32';
import IconFileBoxCanvas from '../../icon/content/FileCanvas32';
import IconFileBoxNote from '../../icon/content/FileBoxNote32';
import IconFileCode from '../../icon/content/FileCode32';
import IconFileDefault from '../../icon/content/FileDefault32';
import IconFileDwg from '../../icon/content/FileDwg32';
import IconFileExcelSpreadsheet from '../../icon/content/FileExcel32';
import IconFileGoogleDocs from '../../icon/content/FileDocs32';
import IconFileGoogleSheets from '../../icon/content/FileSheets32';
import IconFileGoogleSlides from '../../icon/content/FileSlides32';
import IconFileIllustrator from '../../icon/content/FileIllustrator32';
import IconFileImage from '../../icon/content/FileImage32';
import IconFileIndesign from '../../icon/content/FileIndesign32';
import IconFileKeynote from '../../icon/content/FileKeynote32';
import IconFileNumbers from '../../icon/content/FileNumbers32';
import IconFilePages from '../../icon/content/FilePages32';
import IconFilePDF from '../../icon/content/FilePdf32';
import IconFilePhotoshop from '../../icon/content/FilePhotoshop32';
import IconFilePowerpointPresentation from '../../icon/content/FilePowerpoint32';
import IconFilePresentation from '../../icon/content/FilePresentation32';
import IconFileSpreadsheet from '../../icon/content/FileSpreadsheet32';
import IconFileText from '../../icon/content/FileText32';
import IconFileThreeD from '../../icon/content/FileThreeD32';
import IconFileVector from '../../icon/content/FileVector32';
import IconFileVideo from '../../icon/content/FileVideo32';
import IconFileWordDocument from '../../icon/content/FileWord32';
import IconFileXbd from '../../icon/content/FileXbd32';
import IconFileXdw from '../../icon/content/FileXdw32';
import IconFileZip from '../../icon/content/FileZip32';

const Components: { [key: string]: (props: SVGProps) => JSX.Element } = {
    IconFileAudio,
    IconFileBoxCanvas,
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
    IconFileXbd,
    IconFileXdw,
    IconFileZip,
};

const mirror = (values: Array<string>) =>
    values.reduce((prev: { [key: string]: string }, cur: string) => {
        prev[cur] = cur;
        return prev;
    }, {});

const EXTENSIONS: { [key: string]: { [key: string]: string } } = {
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
    IconFileBoxCanvas: mirror(['boxcanvas']),
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
    IconFileDocument: mirror(['dot', 'dotx', 'msg', 'odt', 'rtf', 'wpd', 'xhtml', 'xml', 'xsd', 'xsl']),
    IconFileDwg: mirror(['dwg', 'dwgzip']),
    IconFileExcelSpreadsheet: mirror(['xls', 'xlsx', 'xlsm', 'xlsb']),
    IconFileGoogleDocs: mirror(['gdoc']),
    IconFileGoogleSheets: mirror(['gsheet']),
    IconFileGoogleSlides: mirror(['gslide', 'gslides']),
    IconFileVector: mirror(['eps']),
    IconFileIllustrator: mirror(['ai']),
    IconFileIndesign: mirror(['idml', 'indd', 'indt', 'inx']),
    IconFileKeynote: mirror(['key']),
    IconFileNumbers: mirror(['numbers']),
    IconFilePages: mirror(['pages']),
    IconFileImage: mirror([
        'bmp',
        'gif',
        'gdraw',
        'jpeg',
        'jpg',
        'png',
        'ps',
        'svs',
        'svg',
        'tif',
        'tiff',
        'heic',
        'heif',
    ]),
    IconFilePDF: mirror(['pdf']),
    IconFilePresentation: mirror(['odp', 'otp', 'pot', 'potx']),
    IconFilePowerpointPresentation: mirror(['ppt', 'pptx', 'pptm']),
    IconFilePhotoshop: mirror(['psd']),
    IconFileSpreadsheet: mirror(['csv', 'ods', 'tsv', 'xlt', 'xltx']),
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
    IconFileXbd: mirror(['xbd']),
    IconFileXdw: mirror(['xdw']),
    IconFileZip: mirror(['rar', 'tgz', 'zip']),
};

const getFileIconComponent = (extension = '') => {
    const extensionComponentName = Object.keys(EXTENSIONS).filter(
        extensionComponent => !!EXTENSIONS[extensionComponent][extension.toLowerCase()],
    )[0];
    return extensionComponentName || 'IconFileDefault';
};

interface FileIconProps {
    /** Dimension of the icon. */
    dimension?: number;
    /** Extension of file to display icon for. Defaults to generic icon */
    extension?: string;
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.ReactElement<string>;
    /** Accessibility label for the icon */
    'aria-label'?: string;
    /** Role attribute for accessibility */
    role?: string;
    /** Additional class name */
    className?: string;
}

const FileIcon = ({ dimension = 32, extension = '', title = 'File', className }: FileIconProps): JSX.Element => {
    const IconComponent = Components[getFileIconComponent(extension)];
    return <IconComponent height={dimension} width={dimension} title={title} className={className} />;
};

export default FileIcon;
