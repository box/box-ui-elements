import * as React from 'react';
import { useIntl } from 'react-intl';
import { Archive, FolderArchive, FileBookmark } from '@box/blueprint-web-assets/icons/Content';
import FileIcon from '../../../icons/file-icon/FileIcon';
import FolderIcon from '../../../icons/folder-icon/FolderIcon';
import { TYPE_FOLDER, TYPE_FILE, TYPE_WEBLINK } from '../../../constants';
import messages from '../messages';
import './IconCell.scss';
const IconCell = ({
  rowData,
  dimension
}) => {
  const {
    formatMessage
  } = useIntl();
  const {
    type,
    extension,
    has_collaborations,
    is_externally_owned,
    archive_type
  } = rowData;
  const isArchive = archive_type === 'archive';
  const isArchiveFolder = archive_type === 'folder_archive';
  switch (type) {
    case TYPE_FILE:
      return /*#__PURE__*/React.createElement(FileIcon, {
        dimension: dimension,
        extension: extension
      });
    case TYPE_FOLDER:
      if (isArchive) {
        return /*#__PURE__*/React.createElement(Archive, {
          "aria-label": formatMessage(messages.archive),
          height: dimension,
          width: dimension
        });
      }
      if (isArchiveFolder) {
        return /*#__PURE__*/React.createElement(FolderArchive, {
          "aria-label": formatMessage(messages.archivedFolder),
          height: dimension,
          width: dimension
        });
      }
      return /*#__PURE__*/React.createElement(FolderIcon, {
        dimension: dimension,
        isCollab: has_collaborations,
        isExternal: is_externally_owned
      });
    case TYPE_WEBLINK:
      return /*#__PURE__*/React.createElement(FileBookmark, {
        "aria-label": formatMessage(messages.bookmark),
        height: dimension,
        width: dimension
      });
    default:
      return /*#__PURE__*/React.createElement(FileIcon, {
        dimension: dimension
      });
  }
};
export default IconCell;
//# sourceMappingURL=IconCell.js.map