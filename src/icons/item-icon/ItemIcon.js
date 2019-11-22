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

import BookmarkIcon from '../imported/IconFileBookmark32';

import IconFolderCollab from '../imported/IconFolderShared32';
import IconFolderExternal from '../imported/IconFolderExternal32';
import IconFolderPersonal from '../imported/IconFolderPersonal32';

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
