import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../../components/button';
import messages from './messages';
import RefreshIcon from './RefreshIcon';
const Error = ({
  onClick
}) => /*#__PURE__*/React.createElement("div", {
  className: "bcs-DocGen-error-state",
  "data-testid": "docgen-sidebar-error"
}, /*#__PURE__*/React.createElement(RefreshIcon, {
  className: "bcs-DocGen-error-state--icon"
}), /*#__PURE__*/React.createElement("p", {
  className: "bcs-DocGen-error-state--message"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.errorCouldNotLoad)), /*#__PURE__*/React.createElement(Button, {
  onClick: onClick
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.errorRefreshButton)));
export default Error;
//# sourceMappingURL=Error.js.map