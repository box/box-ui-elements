function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from './constants';
import messages from './messages';
const AccessLabel = ({
  accessLevel,
  enterpriseName,
  itemType
}) => {
  switch (accessLevel) {
    case PEOPLE_WITH_LINK:
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.peopleWithTheLink);
    case PEOPLE_IN_COMPANY:
      return enterpriseName ? /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.peopleInEnterprise, {
        values: {
          enterpriseName
        }
      })) : /*#__PURE__*/React.createElement(FormattedMessage, messages.peopleInYourCompany);
    case PEOPLE_IN_ITEM:
      return itemType === 'folder' ? /*#__PURE__*/React.createElement(FormattedMessage, messages.peopleInThisFolder) : /*#__PURE__*/React.createElement(FormattedMessage, messages.peopleInThisFile);
    default:
      return null;
  }
};
export default AccessLabel;
//# sourceMappingURL=AccessLabel.js.map