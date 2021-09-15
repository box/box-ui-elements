import * as React from 'react';
import { SVGProps } from '../../components/accessible-svg/AccessibleSVG';

import IconFileAudio from '../../icon/content/FileAudio32';
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
import IconFileZip from '../../icon/content/FileZip32';

import BookmarkIcon from '../../icon/content/FileBookmark32';

import IconFolderCollab from '../../icon/content/FolderShared32';
import IconFolderExternal from '../../icon/content/FolderExternal32';
import IconFolderPersonal from '../../icon/content/FolderPersonal32';

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

export interface ItemIconProps {
    /** Additional class name */
    className?: string;
    /** Dimension of the icon. Defaults to 32x32 */
    dimension?: number;
    /** Type of item icon, defaults to the default icon if icon type is not recognized */
    iconType: keyof typeof itemIconTable | string;
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.ReactNode;
}

const ItemIcon = ({ className, dimension = 32, iconType, title }: ItemIconProps) => {
    const IconComponent = (itemIconTable as { [key: string]: React.FC<SVGProps> })[iconType] || IconFileDefault;
    return <IconComponent className={className} height={dimension} title={title} width={dimension} />;
};

export default ItemIcon;
