const _excluded = ["className", "isEditing", "onEdit"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * 
 * @file Classification add/edit button
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import PlainButton from '../../components/plain-button/PlainButton';
const EditClassificationButton = _ref => {
  let {
      className = '',
      isEditing,
      onEdit
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const message = isEditing ? messages.edit : messages.add;
  const interaction = isEditing ? 'editclassification' : 'addclassification';
  return /*#__PURE__*/React.createElement(PlainButton, _extends({
    className: `bdl-EditClassificationButton ${className}`,
    "data-resin-target": interaction,
    onClick: onEdit,
    type: "button"
  }, rest), /*#__PURE__*/React.createElement(FormattedMessage, message));
};
export default EditClassificationButton;
//# sourceMappingURL=EditClassificationButton.js.map