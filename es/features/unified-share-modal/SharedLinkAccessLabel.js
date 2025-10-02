function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ANYONE_WITH_LINK, ANYONE_IN_COMPANY, PEOPLE_IN_ITEM } from './constants';
import SharedLinkAccessDescription from './SharedLinkAccessDescription';
import messages from './messages';
const SharedLinkAccessLabel = ({
  accessLevel,
  enterpriseName,
  hasDescription,
  itemType
}) => {
  const messageKeyMap = {
    [ANYONE_WITH_LINK]: 'peopleWithTheLinkText',
    [ANYONE_IN_COMPANY]: enterpriseName === '' ? 'peopleInYourCompany' : 'peopleInEnterpriseName',
    [PEOPLE_IN_ITEM]: itemType === 'folder' ? 'peopleInThisFolder' : 'peopleInThisFile'
  };
  let messageName;
  if (accessLevel) {
    messageName = messageKeyMap[accessLevel];
  } else {
    return null;
  }
  return hasDescription ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages[messageName], {
    values: {
      enterpriseName
    }
  }))), /*#__PURE__*/React.createElement(SharedLinkAccessDescription, {
    accessLevel: accessLevel,
    enterpriseName: enterpriseName,
    itemType: itemType
  })) : /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages[messageName], {
    values: {
      enterpriseName
    }
  }));
};
export default SharedLinkAccessLabel;
//# sourceMappingURL=SharedLinkAccessLabel.js.map