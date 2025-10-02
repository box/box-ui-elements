import * as React from 'react';
import classNames from 'classnames';
import CloseButton from '../close-button/CloseButton';
// @ts-ignore flow
import FlyoutContext from './FlyoutContext';
import './OverlayHeader.scss';
const OverlayHeader = ({
  children,
  className,
  isOverlayHeaderActionEnabled = false
}) => {
  const handleClick = event => {
    if (!isOverlayHeaderActionEnabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  // @ts-ignore TODO: figure out why this is giving a TS error
  const {
    closeOverlay
  } = React.useContext(FlyoutContext);
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('bdl-OverlayHeader', className),
    "data-testid": "bdl-OverlayHeader",
    onClick: handleClick,
    role: "presentation"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdl-OverlayHeader-content"
  }, children), /*#__PURE__*/React.createElement(CloseButton, {
    onClick: closeOverlay
  }));
};
export default OverlayHeader;
//# sourceMappingURL=OverlayHeader.js.map