import { FIELD_FILE_VERSION, FIELD_SHA1, FIELD_SHARED_LINK, FIELD_WATERMARK_INFO } from '../../constants';
import { FOLDER_FIELDS_TO_FETCH } from '../../utils/fields';

// Fields needed for Content Explorer folder requests
export const CONTENT_EXPLORER_FOLDER_FIELDS_TO_FETCH = [
    ...FOLDER_FIELDS_TO_FETCH,
    FIELD_FILE_VERSION,
    FIELD_SHA1,
    FIELD_SHARED_LINK,
    FIELD_WATERMARK_INFO,
];

export const NON_FOLDER_FILE_TYPES_MAP = new Map([
    ['boxnoteType', ['boxnote']],
    ['boxcanvasType', ['boxcanvas']],
    ['pdfType', ['pdf']],
    ['documentType', ['doc', 'docx', 'gdoc', 'rtf', 'txt']],
    ['spreadsheetType', ['xls', 'xlsx', 'xlsm', 'csv', 'gsheet']],
    ['presentationType', ['ppt', 'pptx', 'odp']],
    ['imageType', ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tif', 'tiff']],
    ['audioType', ['mp3', 'm4a', 'm4p', 'wav', 'mid', 'wma']],
    [
        'videoType',
        [
            'mp4',
            'mpeg',
            'mpg',
            'wmv',
            '3g2',
            '3gp',
            'avi',
            'm2v',
            'm4v',
            'mkv',
            'mov',
            'ogg',
            'mts',
            'qt',
            'ts',
            'flv',
            'rm',
        ],
    ],
    ['drawingType', ['dwg', 'dxf']],
    ['threedType', ['obj', 'fbx', 'stl', 'amf', 'iges']],
]);

export const FILE_FOLDER_TYPES_MAP = new Map(NON_FOLDER_FILE_TYPES_MAP).set('folderType', ['folder']);

export const NON_FOLDER_FILE_TYPES = Array.from(NON_FOLDER_FILE_TYPES_MAP.keys());
