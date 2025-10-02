function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import PlainButton from '../../components/plain-button';
import IconClose from '../../icons/general/IconClose';
import './styles/RemoveButton.scss';
const RemoveButton = ({
  onClickRemove,
  removeButtonHtmlAttributes = {}
}) => /*#__PURE__*/React.createElement(PlainButton, _extends({
  className: "lsb-remove-button",
  onClick: onClickRemove
}, removeButtonHtmlAttributes), /*#__PURE__*/React.createElement(IconClose, {
  className: "lsb-remove-button-icon",
  width: 13
}));
export default RemoveButton;
//# sourceMappingURL=RemoveButton.js.map