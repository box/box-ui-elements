/**
 * 
 * @file Pagination controls for navigation
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PaginationMenu from './PaginationMenu';
import Button from '../../components/button';
import ButtonGroup from '../../components/button-group';
import IconPageBack from '../../icons/general/IconPageBack';
import IconPageForward from '../../icons/general/IconPageForward';
import Tooltip from '../../elements/common/Tooltip';
import messages from '../../elements/common/messages';
const PAGE_ICON_STYLE = {
  height: 9,
  width: 6
};
const PaginationControls = ({
  handleNextClick,
  handlePreviousClick,
  hasNextPage,
  hasPreviousPage,
  isOffsetBasedPagination = true,
  onPageClick,
  pageCount = 0,
  pageNumber = 0
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "bdl-Pagination"
  }, isOffsetBasedPagination && /*#__PURE__*/React.createElement("div", {
    className: "bdl-Pagination-count"
  }, /*#__PURE__*/React.createElement(PaginationMenu, {
    onPageClick: onPageClick,
    pageCount: pageCount,
    pageNumber: pageNumber
  })), /*#__PURE__*/React.createElement(ButtonGroup, {
    className: "bdl-Pagination-nav"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    isDisabled: !hasPreviousPage,
    text: /*#__PURE__*/React.createElement(FormattedMessage, messages.previousPage)
  }, /*#__PURE__*/React.createElement(Button, {
    isDisabled: !hasPreviousPage,
    onClick: handlePreviousClick
  }, /*#__PURE__*/React.createElement(IconPageBack, PAGE_ICON_STYLE))), /*#__PURE__*/React.createElement(Tooltip, {
    isDisabled: !hasNextPage,
    text: /*#__PURE__*/React.createElement(FormattedMessage, messages.nextPage)
  }, /*#__PURE__*/React.createElement(Button, {
    isDisabled: !hasNextPage,
    onClick: handleNextClick
  }, /*#__PURE__*/React.createElement(IconPageForward, PAGE_ICON_STYLE)))));
};
export default PaginationControls;
//# sourceMappingURL=PaginationControls.js.map