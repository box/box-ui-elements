import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
const Pill = ({
  isDisabled = false,
  isSelected = false,
  isValid = true,
  onRemove,
  text
}) => {
  const styles = classNames('bdl-Pill', 'pill', {
    'is-selected': isSelected && !isDisabled,
    'is-invalid': !isValid,
    'is-disabled': isDisabled,
    'bdl-is-disabled': isDisabled
  });
  const onClick = isDisabled ? noop : onRemove;
  return /*#__PURE__*/React.createElement("span", {
    className: styles
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdl-Pill-text pill-text"
  }, text), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "close-btn",
    onClick: onClick
  }, "\u2715"));
};
export default Pill;
//# sourceMappingURL=Pill.js.map