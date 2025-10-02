function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file PaginationMenu component
 * @author Box
 */

import * as React from 'react';
import range from 'lodash/range';
import { FormattedMessage } from 'react-intl';
import Button from '../../components/button';
import DropdownMenu from '../../components/dropdown-menu';
import { Menu, MenuItem } from '../../components/menu';
import messages from '../../elements/common/messages';
import './PaginationMenu.scss';
const PaginationMenu = ({
  onPageClick,
  pageCount = 0,
  pageNumber = 0
}) => /*#__PURE__*/React.createElement(DropdownMenu, {
  className: "bdl-Pagination-dropdown",
  constrainToWindow: true,
  isRightAligned: true
}, /*#__PURE__*/React.createElement(Button, {
  className: "bdl-Pagination-toggle"
}, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.pageStatus, {
  values: {
    pageNumber,
    pageCount
  }
}))), /*#__PURE__*/React.createElement(Menu, {
  className: "bdl-Pagination-dropdownMenu"
}, range(1, pageCount + 1).map(page => /*#__PURE__*/React.createElement(MenuItem, {
  key: page,
  isDisabled: page === pageNumber,
  onClick: () => onPageClick(page)
}, page))));
export default PaginationMenu;
//# sourceMappingURL=PaginationMenu.js.map