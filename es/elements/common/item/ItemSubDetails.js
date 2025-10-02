function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import getSize from '../../../utils/size';
import DateField from '../date';
import { VIEW_RECENTS } from '../../../constants';
import messages from '../messages';
import './ItemSubDetails.scss';
const ItemSubDetails = ({
  item,
  view
}) => {
  const {
    modified_at = '',
    interacted_at = '',
    modified_by
  } = item;
  const modifiedBy = modified_by ? modified_by.name || '' : '';
  const isRecents = view === VIEW_RECENTS;
  const date = isRecents ? interacted_at || modified_at : modified_at;
  const {
    size
  } = item;
  const DateValue = /*#__PURE__*/React.createElement(DateField, {
    date: date,
    omitCommas: true
  });
  let message = messages.modifiedDateBy;
  if (isRecents) {
    message = messages.interactedDate;
  } else if (!modifiedBy) {
    message = messages.modifiedDate;
  }
  return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "bdl-ItemSubDetails-modifiedBy"
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, message, {
    values: {
      date: DateValue,
      name: modifiedBy
    }
  }))), /*#__PURE__*/React.createElement("span", {
    className: "bdl-ItemSubDetails-size"
  }, getSize(size)));
};
export default ItemSubDetails;
//# sourceMappingURL=ItemSubDetails.js.map