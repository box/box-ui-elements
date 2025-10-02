import * as React from 'react';
import IconFileAudio from '../../icon/fill/FileAudio16';
import IconFileBoxNote from '../../icon/fill/FileBoxNote16';
import IconFileCode from '../../icon/fill/FileCode16';
import IconFileDefault from '../../icon/fill/FileDefault16';
import IconFileDwg from '../../icon/fill/FileDwg16';
import IconFileExcelSpreadsheet from '../../icon/fill/FileExcel16';
import IconFileGoogleDocs from '../../icon/fill/FileDocs16';
import IconFileGoogleSheets from '../../icon/fill/FileSheets16';
import IconFileGoogleSlides from '../../icon/fill/FileSlides16';
import IconFileIllustrator from '../../icon/fill/FileIllustrator16';
import IconFileImage from '../../icon/fill/FileImage16';
import IconFileIndesign from '../../icon/fill/FileIndesign16';
import IconFileKeynote from '../../icon/fill/FileKeynote16';
import IconFileNumbers from '../../icon/fill/FileNumbers16';
import IconFilePages from '../../icon/fill/FilePages16';
import IconFilePDF from '../../icon/fill/FilePdf16';
import IconFilePhotoshop from '../../icon/fill/FilePhotoshop16';
import IconFilePowerpointPresentation from '../../icon/fill/FilePowerpoint16';
import IconFilePresentation from '../../icon/fill/FilePresentation16';
import IconFileSpreadsheet from '../../icon/fill/FileSpreadsheet16';
import IconFileText from '../../icon/fill/FileText16';
import IconFileThreeD from '../../icon/fill/FileThreeD16';
import IconFileVector from '../../icon/fill/FileVector16';
import IconFileVideo from '../../icon/fill/FileVideo16';
import IconFileWordDocument from '../../icon/fill/FileWord16';
import IconFileZip from '../../icon/fill/FileZip16';
import BookmarkIcon from '../../icon/fill/FileBookmark16';
import IconFolderCollab from '../../icon/fill/FolderShared16';
import IconFolderExternal from '../../icon/fill/FolderExternal16';
import IconFolderPersonal from '../../icon/fill/FolderPersonal16';
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
  zip: IconFileZip
};
const ItemIconMonotone = ({
  className,
  dimension = 32,
  iconType,
  title
}) => {
  const IconComponent = itemIconTable[iconType] || IconFileDefault;
  return /*#__PURE__*/React.createElement(IconComponent, {
    className: className,
    height: dimension,
    title: title,
    width: dimension
  });
};
export default ItemIconMonotone;
//# sourceMappingURL=ItemIconMonotone.js.map