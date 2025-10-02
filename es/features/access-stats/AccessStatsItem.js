function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import PlainButton from '../../components/plain-button/PlainButton';
import IconEye from '../../icons/general/IconEye';
import IconComment from '../../icons/general/IconComment';
import IconDownloadSolid from '../../icons/general/IconDownloadSolid';
import IconPencilSolid from '../../icons/general/IconPencilSolid';
import messages from './messages';
import './AccessStatsItem.scss';
const statsAttributesTable = {
  preview: {
    icon: IconEye,
    message: messages.accessStatsPreviews
  },
  view: {
    icon: IconEye,
    message: messages.accessStatsViews
  },
  download: {
    icon: IconDownloadSolid,
    message: messages.accessStatsDownloads
  },
  comment: {
    icon: IconComment,
    message: messages.accessStatsComments
  },
  edit: {
    icon: IconPencilSolid,
    message: messages.accessStatsEdits
  }
};
const ICON_COLOR = '#2a62b9';
const ITEM_CONTENT_CLASS_NAME = 'access-stats-item-content';
const AccessStatsItem = ({
  type,
  count = 0,
  hasCountOverflowed = false,
  openAccessStatsModal,
  statButtonProps
}) => {
  const statAttributes = statsAttributesTable[type];
  const IconComponent = statAttributes.icon;
  const labelMessage = statAttributes.message;
  const itemContent = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconComponent, {
    color: ICON_COLOR,
    height: 10,
    width: 14
  }), /*#__PURE__*/React.createElement("span", {
    className: "access-stats-label"
  }, /*#__PURE__*/React.createElement(FormattedMessage, labelMessage)), /*#__PURE__*/React.createElement(FormattedNumber, {
    value: count
  }), hasCountOverflowed && '+');
  return /*#__PURE__*/React.createElement("li", {
    className: "access-stats-item"
  }, openAccessStatsModal ? /*#__PURE__*/React.createElement(PlainButton, _extends({
    className: ITEM_CONTENT_CLASS_NAME,
    onClick: openAccessStatsModal
  }, statButtonProps), itemContent) : /*#__PURE__*/React.createElement("span", {
    className: ITEM_CONTENT_CLASS_NAME
  }, itemContent));
};
export default AccessStatsItem;
//# sourceMappingURL=AccessStatsItem.js.map