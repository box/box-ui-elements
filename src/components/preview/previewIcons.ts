/**
 * Note: This map is intentionally kept separate from other icon maps, such as FileIcon. Preview only shows
 * file-specific loading icons for file types that can be previewed. Unsupported files show a default
 * icon, even if they have a relevant thumbnail/icon that is displayed within the item list, for example.
 */
import * as vars from '../../styles/variables';
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
import IconFilePDF from '../../icon/content/FilePdf32';
import IconFilePages from '../../icon/content/FilePages32';
import IconFilePhotoshop from '../../icon/content/FilePhotoshop32';
import IconFilePowerpoint from '../../icon/content/FilePowerpoint32';
import IconFilePresentation from '../../icon/content/FilePresentation32';
import IconFileSpreadsheet from '../../icon/content/FileSpreadsheet32';
import IconFileText from '../../icon/content/FileText32';
import IconFileThreeD from '../../icon/content/FileThreeD32';
import IconFileVector from '../../icon/content/FileVector32';
import IconFileVideo from '../../icon/content/FileVideo32';
import IconFileWord from '../../icon/content/FileWord32';
import IconFileXbd from '../../icon/content/FileXbd32';
import IconFileXdw from '../../icon/content/FileXdw32';
import IconFileZip from '../../icon/content/FileZip32';
import { SVGProps } from '../accessible-svg/AccessibleSVG';

type Config = { color: string; icon: Icon };
type Configs = { [key: string]: Config }; // { docx: { color: '#333', icon: IconFileWord }
type Icon = (props: SVGProps) => React.ReactElement;

const configs: Configs = {};
const register = (icon: Icon, color: string, extensions: string[]): void => {
    extensions.forEach(extension => {
        configs[extension] = { color, icon };
    });
};

register(IconFileAudio, vars.bdlPurpleRain, [
    'aac',
    'aif',
    'aifc',
    'aiff',
    'amr',
    'au',
    'flac',
    'm4a',
    'mp3',
    'ra',
    'wav',
    'wma',
]);
register(IconFileBoxCanvas, vars.bdlOrange, ['boxcanvas']);
register(IconFileBoxNote, vars.bdlGray20, ['boxnote']);
register(IconFileCode, '#E33D55', [
    'as',
    'as3',
    'asm',
    'bat',
    'c',
    'cc',
    'cmake',
    'cpp',
    'cs',
    'css',
    'cxx',
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
    'json',
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
    'rst',
    'sass',
    'scala',
    'script',
    'scm',
    'sml',
    'sql',
    'sh',
    'vi',
    'vim',
    'xhtml',
    'xml',
    'xsd',
    'xsl',
    'yaml',
]);
register(IconFileDwg, '#009AED', ['dwg']);
register(IconFileIllustrator, '#FF9400', ['ai']);
register(IconFileExcelSpreadsheet, '#107C41', ['xls', 'xlsm', 'xlsx', 'xlsb']);
register(IconFileGoogleDocs, '#4083F7', ['gdoc']);
register(IconFileGoogleSheets, '#21A464', ['gsheet']);
register(IconFileGoogleSlides, '#F7BA00', ['gslide', 'gslides']);
register(IconFileImage, '#3FB87F', [
    'bmp',
    'cr2',
    'crw',
    'dcm',
    'dng',
    'gif',
    'heic',
    'jpeg',
    'jpg',
    'nef',
    'png',
    'ps',
    'raf',
    'raw',
    'svg',
    'swf',
    'tga',
    'tif',
    'tiff',
]);
register(IconFileIndesign, '#FF57A1', ['idml', 'indd', 'indt', 'inx']);
register(IconFileKeynote, '#007AFF', ['key']);
register(IconFileNumbers, '#00A650', ['numbers']);
register(IconFilePDF, '#D0021B', ['pdf']);
register(IconFilePages, '#FF9500', ['pages']);
register(IconFilePhotoshop, '#26C9FF', ['psd']);
register(IconFilePowerpoint, '#C43E1C', ['ppt', 'pptx']);
register(IconFilePresentation, '#F7931D', ['odp']);
register(IconFileSpreadsheet, '#3FB87F', ['csv', 'tsv']);
register(IconFileText, vars.bdlBoxBlue, ['log', 'msg', 'ods', 'odt', 'rtf', 'txt', 'webdoc', 'wpd']);
register(IconFileThreeD, '#F7931D', ['3ds', 'box3d', 'dae', 'fbx', 'obj', 'ply', 'stl']);
register(IconFileVector, '#F7931D', ['eps']);
register(IconFileVideo, '#009AED', [
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
    'mts',
    'ogg',
    'qt',
    'ts',
    'wmv',
]);
register(IconFileWord, '#185ABD', ['doc', 'docx']);
register(IconFileXbd, '#00838D', ['xbd']);
register(IconFileXdw, '#00838D', ['xdw']);
register(IconFileZip, vars.bdlGray20, ['tgz', 'zip']);

export const getColor = (extension?: string): Config['color'] => {
    return extension && configs[extension] ? configs[extension].color : vars.bdlBoxBlue;
};

export const getIcon = (extension?: string): Config['icon'] => {
    return extension && configs[extension] ? configs[extension].icon : IconFileDefault;
};
