function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Classification, { getClassificationLabelColor } from '../classification';
import messages from './messages';
function getTitle(isEmailLinkSectionExpanded, showCollaboratorList, item) {
  const {
    name
  } = item;
  let title;
  if (isEmailLinkSectionExpanded) {
    title = /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.emailModalTitle, {
      values: {
        itemName: name
      }
    }));
  } else if (showCollaboratorList) {
    title = /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.collaboratorListTitle, {
      values: {
        itemName: name
      }
    }));
  } else {
    title = /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.modalTitle, {
      values: {
        itemName: name
      }
    }));
  }
  return title;
}
const UnifiedShareModalTitle = ({
  isEmailLinkSectionExpanded,
  showCollaboratorList,
  item
}) => {
  const title = getTitle(isEmailLinkSectionExpanded, showCollaboratorList, item);
  const {
    bannerPolicy,
    canUserSeeClassification,
    classification
  } = item;
  const classificationColor = getClassificationLabelColor(bannerPolicy);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "bdl-UnifiedShareModalTitle"
  }, title), canUserSeeClassification && /*#__PURE__*/React.createElement(Classification, {
    definition: bannerPolicy ? bannerPolicy.body : undefined,
    messageStyle: "tooltip",
    name: classification,
    color: classificationColor,
    className: "bdl-UnifiedShareModalTitle-classification"
  }));
};
export default UnifiedShareModalTitle;
//# sourceMappingURL=UnifiedShareModalTitle.js.map