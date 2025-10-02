function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { getFileExtension } from '../../utils/file';
import messages from './messages';
import FileIcon from '../../icons/file-icon';
import FolderIcon from '../../icons/folder-icon';
import PlainButton from '../../components/plain-button/PlainButton';
import baseCellRenderer from './baseCellRenderer';
import './ItemNameCell.scss';
const itemNameCellRenderer = (intl, onClick = noop) => cellRendererParams => baseCellRenderer(cellRendererParams, cellValue => {
  const {
    name,
    type,
    isExternal,
    dataAttributes
  } = cellValue;
  const extension = getFileExtension(name);
  const displayName = isExternal ? intl.formatMessage(messages.externalFile) : name;
  const isFolder = type === 'folder';
  const itemNameCellClass = classNames('bdl-ItemNameCell-name', {
    'bdl-is-external': isExternal,
    'bdl-is-folder': isFolder
  });
  return /*#__PURE__*/React.createElement("span", {
    className: "bdl-ItemNameCell",
    title: displayName
  }, isFolder ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FolderIcon, {
    dimension: 32,
    isExternal: isExternal
  }), /*#__PURE__*/React.createElement(PlainButton, _extends({
    className: itemNameCellClass,
    onClick: () => onClick(cellValue),
    type: "button"
  }, dataAttributes), displayName)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FileIcon, {
    dimension: 32,
    extension: extension
  }), /*#__PURE__*/React.createElement("span", _extends({
    className: itemNameCellClass
  }, dataAttributes), displayName)));
});
export default itemNameCellRenderer;
//# sourceMappingURL=itemNameCellRenderer.js.map