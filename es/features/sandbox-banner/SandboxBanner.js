import * as React from 'react';
import Tooltip from '../../components/tooltip';
import './SandboxBanner.scss';
const SandboxBanner = ({
  children
}) => {
  return /*#__PURE__*/React.createElement(Tooltip, {
    targetWrapperClassName: "bdl-SandboxBanner",
    text: children
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdl-SandboxBanner-text"
  }, children));
};
export default SandboxBanner;
//# sourceMappingURL=SandboxBanner.js.map