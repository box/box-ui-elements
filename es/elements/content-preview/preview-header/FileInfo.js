/**
 * 
 * @file file info section of the preview header
 * @author Box
 */

import * as React from 'react';
import FileIcon from '../../../icons/file-icon/FileIcon';
import './FileInfo.scss';
const FileInfo = ({
  file,
  version
}) => {
  // Opt to show version over the file object since it is more specific
  const displayItem = version || file;
  return /*#__PURE__*/React.createElement("div", {
    className: "bcpr-FileInfo"
  }, displayItem && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FileIcon, {
    dimension: 24,
    extension: displayItem.extension
  }), /*#__PURE__*/React.createElement("span", {
    className: "bcpr-FileInfo-name"
  }, displayItem.name)));
};
export default FileInfo;
//# sourceMappingURL=FileInfo.js.map