function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { convertISOStringToUTCDate } from '../../utils/datetime';
import { FIELD_TYPE_DATE } from './constants';
import messages from './messages';
import './ReadOnlyMetadataField.scss';
const ReadOnlyMetadataField = ({
  dataValue,
  description,
  displayName,
  type
}) => {
  let value = /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "i"
  }, messages.metadataFieldNoValue));
  if (dataValue || typeof dataValue === 'number') {
    if (typeof dataValue === 'string' && type === FIELD_TYPE_DATE) {
      value = /*#__PURE__*/React.createElement(FormattedDate, {
        day: "numeric",
        month: "long",
        value: convertISOStringToUTCDate(dataValue),
        year: "numeric"
      });
    } else if (Array.isArray(dataValue)) {
      value = dataValue.join(', ');
    } else {
      value = dataValue;
    }
  }
  return /*#__PURE__*/React.createElement("dl", {
    className: "bdl-ReadOnlyMetadataField"
  }, /*#__PURE__*/React.createElement("dt", null, displayName), !!description && /*#__PURE__*/React.createElement("i", {
    className: "bdl-ReadOnlyMetadataField-desc"
  }, description), /*#__PURE__*/React.createElement("dd", null, value));
};
export default ReadOnlyMetadataField;
//# sourceMappingURL=ReadOnlyMetadataField.js.map