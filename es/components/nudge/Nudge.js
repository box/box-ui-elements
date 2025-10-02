import * as React from 'react';
import classNames from 'classnames';
import Button from '../button';
import PrimaryButton from '../primary-button';
import X16 from '../../icon/fill/X16';
import './Nudge.scss';
function Nudge({
  buttonText,
  className,
  content,
  dataResinTarget = 'nudgeButton',
  illustration,
  isShown,
  header,
  onButtonClick,
  onCloseButtonClick
}) {
  const classes = classNames(['bdl-Nudge', className], {
    'bdl-is-closed': !isShown
  });
  const closeButton = /*#__PURE__*/React.createElement(Button, {
    "aria-label": "close-nudge",
    className: "bdl-Nudge-closeButton",
    onClick: onCloseButtonClick
  }, /*#__PURE__*/React.createElement(X16, {
    height: 18,
    width: 18
  }));
  return /*#__PURE__*/React.createElement("article", {
    className: classes,
    "data-resin-component": "nudge"
  }, closeButton, /*#__PURE__*/React.createElement("div", {
    className: "bdl-Nudge-illustration"
  }, illustration), /*#__PURE__*/React.createElement("h2", {
    className: "bdl-Nudge-header"
  }, header), /*#__PURE__*/React.createElement("p", {
    className: "bdl-Nudge-content"
  }, content), /*#__PURE__*/React.createElement("div", {
    className: "bdl-Nudge-button"
  }, /*#__PURE__*/React.createElement(PrimaryButton, {
    "data-resin-target": dataResinTarget,
    onClick: onButtonClick
  }, buttonText)));
}
export default Nudge;
//# sourceMappingURL=Nudge.js.map