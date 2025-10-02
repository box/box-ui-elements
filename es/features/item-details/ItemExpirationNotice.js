function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import InlineNotice from '../../components/inline-notice';
import messages from './messages';
const FILE = 'file';
const FOLDER = 'folder';
const WEBLINK = 'web_link';
const ItemExpirationNotice = ({
  expiration,
  itemType
}) => {
  let messageID = '';
  switch (itemType) {
    case FILE:
      messageID = 'fileExpiration';
      break;
    case FOLDER:
      messageID = 'folderExpiration';
      break;
    case WEBLINK:
      messageID = 'bookmarkExpiration';
      break;
    // no default
  }
  return /*#__PURE__*/React.createElement(InlineNotice, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages[messageID], {
    values: {
      expiration
    }
  })));
};
ItemExpirationNotice.propTypes = {
  /** a localized, human-readable string/node representing the expiration date */
  expiration: PropTypes.node.isRequired,
  /** the type of the item */
  itemType: PropTypes.oneOf([FILE, FOLDER, WEBLINK]).isRequired
};
export default ItemExpirationNotice;
//# sourceMappingURL=ItemExpirationNotice.js.map