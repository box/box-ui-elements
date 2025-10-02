function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Arrow16 from '../../../icon/fill/Arrow16';
import Button from '../../../components/button';
import DropdownMenu from '../../../components/dropdown-menu/DropdownMenu';
import IconFolderTree from '../../../icons/general/IconFolderTree';
import { Menu, MenuItem } from '../../../components/menu';
import { FoldersPathPropType } from '../prop-types';
import messages from '../messages';
import { FOLDER_TREE_ICON_HEIGHT, FOLDER_TREE_ICON_WIDTH, BREADCRUMB_ARROW_ICON_HEIGHT, BREADCRUMB_ARROW_ICON_WIDTH, BREADCRUMB_ARROW_ICON_VIEWBOX } from './constants';
const ContentExplorerFolderTreeBreadcrumbs = ({
  foldersPath,
  intl: {
    formatMessage,
    formatNumber
  },
  isFolderTreeButtonHidden,
  numTotalItems,
  onBreadcrumbClick
}) => {
  const currentFolderName = foldersPath[foldersPath.length - 1].name;
  const foldersPathWithoutLast = foldersPath.slice(0, -1);
  return /*#__PURE__*/React.createElement("div", {
    className: "bdl-ContentExplorerFolderTreeBreadcrumbs"
  }, !isFolderTreeButtonHidden && /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(Button, {
    "aria-label": formatMessage(messages.clickToViewPath),
    className: "bdl-ContentExplorerFolderTreeBreadcrumbs-button",
    title: formatMessage(messages.filePath),
    type: "button"
  }, /*#__PURE__*/React.createElement(IconFolderTree, {
    height: FOLDER_TREE_ICON_HEIGHT,
    width: FOLDER_TREE_ICON_WIDTH
  })), /*#__PURE__*/React.createElement(Menu, null, foldersPathWithoutLast.map((folder, i) => /*#__PURE__*/React.createElement(MenuItem, {
    "data-testid": "folder-tree-item",
    key: folder.id,
    onClick: event => onBreadcrumbClick(i, event)
  }, folder.name)))), !isFolderTreeButtonHidden && /*#__PURE__*/React.createElement(Arrow16, {
    className: "bdl-ContentExplorerFolderTreeBreadcrumbs-icon",
    height: BREADCRUMB_ARROW_ICON_HEIGHT,
    width: BREADCRUMB_ARROW_ICON_WIDTH,
    viewBox: BREADCRUMB_ARROW_ICON_VIEWBOX
  }), /*#__PURE__*/React.createElement("span", {
    className: "bdl-ContentExplorerFolderTreeBreadcrumbs-text",
    title: currentFolderName
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.folderTreeBreadcrumbsText, {
    values: {
      folderName: currentFolderName,
      totalItems: formatNumber(numTotalItems)
    }
  }))));
};
ContentExplorerFolderTreeBreadcrumbs.propTypes = {
  foldersPath: FoldersPathPropType.isRequired,
  intl: PropTypes.any,
  isFolderTreeButtonHidden: PropTypes.bool,
  numTotalItems: PropTypes.number.isRequired,
  onBreadcrumbClick: PropTypes.func
};
export { ContentExplorerFolderTreeBreadcrumbs as ContentExplorerFolderTreeBreadcrumbsBase };
export default injectIntl(ContentExplorerFolderTreeBreadcrumbs);
//# sourceMappingURL=ContentExplorerFolderTreeBreadcrumbs.js.map