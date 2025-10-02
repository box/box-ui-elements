import * as React from 'react';
import classNames from 'classnames';
import { TYPE_FOLDER, DEFAULT_ROOT } from '../../constants';
import messages from './messages';
import Breadcrumb from '../../components/breadcrumb';
import FolderIcon from '../../icons/folder-icon';
import FileIcon from '../../icons/file-icon';
import getSize from '../../utils/size';
import { getFileExtension } from '../../utils/file';
import baseCellRenderer from './baseCellRenderer';
import './FilePathCell.scss';
const getName = ({
  name,
  type,
  isExternal,
  id
} = {}, intl) => {
  if (id === DEFAULT_ROOT) {
    return intl.formatMessage(messages.allFiles);
  }
  if (isExternal) {
    const message = type === TYPE_FOLDER ? messages.externalFolder : messages.externalFile;
    return intl.formatMessage(message);
  }
  return name || id;
};
const fileNameCellRenderer = intl => cellRendererParams => baseCellRenderer(cellRendererParams, cellValue => {
  const {
    id,
    name = '',
    size,
    itemPath = [],
    itemType,
    isExternal
  } = cellValue;
  const extension = getFileExtension(name);
  const icon = itemType === TYPE_FOLDER ? /*#__PURE__*/React.createElement(FolderIcon, null) : /*#__PURE__*/React.createElement(FileIcon, {
    extension: extension
  });
  const path = itemPath.map(pathInfo => getName(pathInfo, intl));
  const displaySize = size ? ` (${getSize(size)})` : '';
  const contentName = getName({
    id,
    isExternal,
    type: itemType,
    name
  }, intl);
  const displayName = `${contentName}${displaySize}`;
  const fullPath = [...path, displayName];
  const filePathCellClass = classNames('bdl-FilePathCell', {
    'bdl-is-external': isExternal
  });
  return /*#__PURE__*/React.createElement("span", {
    className: filePathCellClass,
    title: fullPath.join(' > ')
  }, icon, /*#__PURE__*/React.createElement(Breadcrumb, {
    label: "contentPath"
  }, fullPath.map(itemPathName => /*#__PURE__*/React.createElement("span", {
    key: itemPathName,
    className: "bdl-FilePathCell-breadcrumbName"
  }, itemPathName))));
});
export default fileNameCellRenderer;
//# sourceMappingURL=filePathCellRenderer.js.map