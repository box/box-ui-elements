// @flow
import * as React from 'react';

import IconFileAudio from '../imported/Icon/IconFileAudio32';
import IconFileBoxNote from '../imported/Icon/IconFileBoxNote32';
import IconFileCode from '../imported/Icon/IconFileCode32';
import IconFileDefault from '../imported/Icon/IconFileDefault32';
import IconFileDwg from '../imported/Icon/IconFileDwg32';
import IconFileExcelSpreadsheet from '../imported/Icon/IconFileExcel32';
import IconFileGoogleDocs from '../imported/Icon/IconFileDocs32';
import IconFileGoogleSheets from '../imported/Icon/IconFileSheets32';
import IconFileGoogleSlides from '../imported/Icon/IconFileSlides32';
import IconFileIllustrator from '../imported/Icon/IconFileIllustrator32';
import IconFileImage from '../imported/Icon/IconFileImage32';
import IconFileIndesign from '../imported/Icon/IconFileIndesign32';
import IconFileKeynote from '../imported/Icon/IconFileKeynote32';
import IconFileNumbers from '../imported/Icon/IconFileNumbers32';
import IconFilePages from '../imported/Icon/IconFilePages32';
import IconFilePDF from '../imported/Icon/IconFilePdf32';
import IconFilePhotoshop from '../imported/Icon/IconFilePhotoshop32';
import IconFilePowerpointPresentation from '../imported/Icon/IconFilePowerpoint32';
import IconFilePresentation from '../imported/Icon/IconFilePresentation32';
import IconFileSpreadsheet from '../imported/Icon/IconFileSpreadsheet32';
import IconFileText from '../imported/Icon/IconFileText32';
import IconFileThreeD from '../imported/Icon/IconFileThreeD32';
import IconFileVector from '../imported/Icon/IconFileVector32';
import IconFileVideo from '../imported/Icon/IconFileVideo32';
import IconFileWordDocument from '../imported/Icon/IconFileWord32';
import IconFileZip from '../imported/Icon/IconFileZip32';

import BookmarkIcon from '../imported/Icon/IconFileBookmark32';

import IconFolderCollab from '../imported/Icon/IconFolderShared32';
import IconFolderExternal from '../imported/Icon/IconFolderExternal32';
import IconFolderPersonal from '../imported/Icon/IconFolderPersonal32';

const itemIconTable = {
    audio: IconFileAudio,
    bookmark: BookmarkIcon,
    boxnote: IconFileBoxNote,
    code: IconFileCode,
    default: IconFileDefault,
    document: IconFileText,
    dwg: IconFileDwg,
    'excel-spreadsheet': IconFileExcelSpreadsheet,
    'folder-collab': IconFolderCollab,
    'folder-external': IconFolderExternal,
    'folder-plain': IconFolderPersonal,
    'google-docs': IconFileGoogleDocs,
    'google-sheets': IconFileGoogleSheets,
    'google-slides': IconFileGoogleSlides,
    illustrator: IconFileIllustrator,
    image: IconFileImage,
    indesign: IconFileIndesign,
    keynote: IconFileKeynote,
    numbers: IconFileNumbers,
    pages: IconFilePages,
    pdf: IconFilePDF,
    photoshop: IconFilePhotoshop,
    'powerpoint-presentation': IconFilePowerpointPresentation,
    presentation: IconFilePresentation,
    spreadsheet: IconFileSpreadsheet,
    text: IconFileText,
    threed: IconFileThreeD,
    vector: IconFileVector,
    video: IconFileVideo,
    'word-document': IconFileWordDocument,
    zip: IconFileZip,
};

type Props = {
    /** Additional class name */
    className?: string,
    /** Dimension of the icon. Defaults to 32x32 */
    dimension?: number,
    /** Type of item icon, defaults to the default icon if icon type is not recognized */
    iconType: string,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
};

const ItemIcon = ({ className, dimension = 32, iconType, title }: Props) => {
    const IconComponent = itemIconTable[iconType] || IconFileDefault;
    return <IconComponent className={className} height={dimension} title={title} width={dimension} />;
};

export default ItemIcon;
