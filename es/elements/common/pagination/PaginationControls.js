function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, IconButton, Tooltip } from '@box/blueprint-web';
import { PointerChevronLeft, PointerChevronRight } from '@box/blueprint-web-assets/icons/Fill';
import messages from '../messages';
import './Pagination.scss';
const PaginationControls = ({
  handleNextClick,
  handlePreviousClick,
  hasNextPage,
  hasPageEntryStatus = true,
  hasPreviousPage,
  isSmall,
  offset = 0,
  pageSize = 0,
  totalCount = 0
}) => {
  const {
    formatMessage
  } = useIntl();
  const startEntryIndex = offset + 1;
  const endEntryIndex = Math.min(offset + pageSize, totalCount);
  return /*#__PURE__*/React.createElement("div", {
    className: "bdl-Pagination"
  }, hasPageEntryStatus && /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.pageEntryStatus, {
    values: {
      startEntryIndex,
      endEntryIndex,
      totalCount
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "bdl-Pagination-buttons"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    content: formatMessage(messages.previousPage)
  }, isSmall ? /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": formatMessage(messages.previousPageButton),
    className: "bdl-Pagination-iconButton",
    disabled: !hasPreviousPage,
    icon: PointerChevronLeft,
    onClick: handlePreviousClick,
    size: "large"
  }) : /*#__PURE__*/React.createElement(Button, {
    disabled: !hasPreviousPage,
    onClick: handlePreviousClick,
    variant: "secondary"
  }, formatMessage(messages.previousPageButton))), /*#__PURE__*/React.createElement(Tooltip, {
    content: formatMessage(messages.nextPage)
  }, isSmall ? /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": formatMessage(messages.nextPageButton),
    className: "bdl-Pagination-iconButton",
    disabled: !hasNextPage,
    icon: PointerChevronRight,
    onClick: handleNextClick,
    size: "large"
  }) : /*#__PURE__*/React.createElement(Button, {
    disabled: !hasNextPage,
    onClick: handleNextClick,
    variant: "secondary"
  }, formatMessage(messages.nextPageButton)))));
};
export default PaginationControls;
//# sourceMappingURL=PaginationControls.js.map