function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ANYONE_WITH_LINK, ANYONE_IN_COMPANY, PEOPLE_IN_ITEM } from './constants';
import { ITEM_TYPE_FOLDER, ITEM_TYPE_HUBS } from '../../common/constants';
import messages from './messages';
const SharedLinkAccessDescription = ({
  accessLevel,
  enterpriseName,
  itemType
}) => {
  const getDescriptionForAnyoneInCompany = type => {
    switch (type) {
      case ITEM_TYPE_FOLDER:
        return enterpriseName ? messages.peopleInSpecifiedCompanyCanAccessFolder : messages.peopleInCompanyCanAccessFolder;
      case ITEM_TYPE_HUBS:
        return enterpriseName ? messages.peopleInSpecifiedCompanyCanAccessHub : messages.peopleInCompanyCanAccessHub;
      default:
        return enterpriseName ? messages.peopleInSpecifiedCompanyCanAccessFile : messages.peopleInCompanyCanAccessFile;
    }
  };
  const getDescriptionForPeopleInItem = type => {
    switch (type) {
      case ITEM_TYPE_FOLDER:
        return messages.peopleInItemCanAccessFolder;
      case ITEM_TYPE_HUBS:
        return messages.peopleInItemCanAccessHub;
      default:
        return messages.peopleInItemCanAccessFile;
    }
  };
  let description;
  switch (accessLevel) {
    case ANYONE_WITH_LINK:
      description = messages.peopleWithLinkDescription;
      break;
    case ANYONE_IN_COMPANY:
      description = getDescriptionForAnyoneInCompany(itemType);
      break;
    case PEOPLE_IN_ITEM:
      description = getDescriptionForPeopleInItem(itemType);
      break;
    default:
      return null;
  }
  return /*#__PURE__*/React.createElement("small", {
    className: "usm-menu-description"
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, description, {
    values: {
      company: enterpriseName
    }
  })));
};
export default SharedLinkAccessDescription;
//# sourceMappingURL=SharedLinkAccessDescription.js.map