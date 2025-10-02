function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import PropTypes from 'prop-types';
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Checkbox from '../../../components/checkbox/Checkbox';
import Tooltip from '../../../components/tooltip';
import messages from '../messages';
const ContentExplorerSelectAll = ({
  handleSelectAllClick,
  intl,
  isLabelHidden,
  isSelectAllChecked,
  numTotalItems = 0
}) => /*#__PURE__*/React.createElement("div", {
  className: "content-explorer-select-all-container"
}, !isLabelHidden && /*#__PURE__*/React.createElement("label", {
  className: "content-explorer-select-all-items-counter"
}, numTotalItems === 1 ? /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.result, {
  values: {
    itemsCount: intl.formatNumber(numTotalItems)
  }
})) : /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.results, {
  values: {
    itemsCount: intl.formatNumber(numTotalItems)
  }
}))), !isLabelHidden && /*#__PURE__*/React.createElement("label", {
  className: "content-explorer-select-all-checkbox-label"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.selectAll)), /*#__PURE__*/React.createElement(Tooltip, {
  isShown: isLabelHidden ? undefined : false,
  text: /*#__PURE__*/React.createElement(FormattedMessage, messages.selectAll)
}, /*#__PURE__*/React.createElement(Checkbox, {
  hideLabel: true,
  className: "content-explorer-select-all-checkbox",
  onChange: handleSelectAllClick,
  isChecked: isSelectAllChecked
})));
ContentExplorerSelectAll.propTypes = {
  handleSelectAllClick: PropTypes.func,
  intl: PropTypes.any,
  isSelectAllChecked: PropTypes.bool,
  isLabelHidden: PropTypes.bool,
  numTotalItems: PropTypes.number
};
export { ContentExplorerSelectAll as ContentExplorerSelectAllBase };
export default injectIntl(ContentExplorerSelectAll);
//# sourceMappingURL=ContentExplorerSelectAll.js.map