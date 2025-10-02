import * as React from 'react';
import { injectIntl } from 'react-intl';
import ClearBadge16 from '../../icon/fill/ClearBadge16';
import Search16 from '../../icon/fill/Search16';
import makeLoadable from '../loading-indicator/makeLoadable';
import messages from './messages';
const SearchActions = ({
  hasSubmitAction,
  intl,
  onClear
}) => {
  const {
    formatMessage
  } = intl;
  return /*#__PURE__*/React.createElement("div", {
    className: "action-buttons"
  }, hasSubmitAction ? /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "action-button search-button",
    title: formatMessage(messages.searchButtonTitle)
  }, /*#__PURE__*/React.createElement(Search16, null)) : /*#__PURE__*/React.createElement("div", {
    className: "action-button search-button"
  }, /*#__PURE__*/React.createElement(Search16, null)), /*#__PURE__*/React.createElement("button", {
    className: "action-button clear-button",
    onClick: onClear,
    title: formatMessage(messages.clearButtonTitle),
    type: "button"
  }, /*#__PURE__*/React.createElement(ClearBadge16, null)));
};
export { SearchActions as SearchActionsBase };
export default makeLoadable(injectIntl(SearchActions));
//# sourceMappingURL=SearchActions.js.map