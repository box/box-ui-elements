function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import InlineNotice from '../../components/inline-notice';
import messages from './messages';
const SharedLinkExpirationNotice = ({
  expiration
}) => /*#__PURE__*/React.createElement(InlineNotice, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.sharedLinkExpiration, {
  values: {
    expiration
  }
})));
SharedLinkExpirationNotice.propTypes = {
  /** a localized, human-readable string/node representing the expiration date */
  expiration: PropTypes.node.isRequired
};
export default SharedLinkExpirationNotice;
//# sourceMappingURL=SharedLinkExpirationNotice.js.map