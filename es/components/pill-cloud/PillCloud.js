function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import Button from '../button';
const PillCloud = ({
  options,
  onSelect,
  selectedOptions = [],
  buttonProps = {}
}) => /*#__PURE__*/React.createElement("div", {
  className: "bdl-PillCloud pill-cloud-container"
}, options && options.map(option => /*#__PURE__*/React.createElement(Button, _extends({
  key: option.value,
  className: classNames('bdl-Pill', 'bdl-PillCloud-button', 'pill', 'pill-cloud-button', {
    'is-selected': selectedOptions.find(op => isEqual(op, option))
  }),
  onClick: onSelect ? () => onSelect(option) : undefined,
  "data-resin-target": option.value
}, buttonProps), option.displayText)));
export default PillCloud;
//# sourceMappingURL=PillCloud.js.map