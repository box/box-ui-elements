const _excluded = ["breadcrumbProps", "className", "customInput", "title", "description", "isOpen", "isResponsive", "onRequestClose", "onSelectedClick", "onSelectItem", "shouldNotUsePortal", "infoNoticeText"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import Column from '@box/react-virtualized/dist/commonjs/Table/Column';
import ContentExplorer from '../content-explorer';
import { Modal } from '../../../components/modal';
import './ContentExplorerModal.scss';
const ContentExplorerModal = _ref => {
  let {
      breadcrumbProps = {},
      className = '',
      customInput,
      title = '',
      description = '',
      isOpen = false,
      isResponsive = false,
      onRequestClose,
      onSelectedClick,
      onSelectItem,
      shouldNotUsePortal = false,
      infoNoticeText = ''
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(Modal, {
    title: title,
    className: classNames('content-explorer-modal', className, {
      'bdl-ContentExplorerModal--responsive': isResponsive
    }),
    isOpen: isOpen,
    onRequestClose: onRequestClose,
    shouldNotUsePortal: shouldNotUsePortal
  }, description, /*#__PURE__*/React.createElement(ContentExplorer, _extends({
    breadcrumbProps: breadcrumbProps,
    customInput: customInput,
    isResponsive: isResponsive,
    onCancelButtonClick: onRequestClose,
    onSelectedClick: onSelectedClick,
    onSelectItem: onSelectItem,
    listWidth: 560,
    listHeight: 285,
    infoNoticeText: infoNoticeText
  }, rest)));
};
export default ContentExplorerModal;
//# sourceMappingURL=ContentExplorerModal.js.map