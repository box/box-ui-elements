import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { bdlBoxBlue } from '../../../styles/variables';
import Tooltip from '../../../components/tooltip';
import IconInfo from '../../../icons/general/IconInfo';
import './SecurityControlsItem.scss';
const ICON_SIZE = 13;
const SecurityControlsItem = ({
  message,
  tooltipMessage
}) => {
  return /*#__PURE__*/React.createElement("li", {
    className: "bdl-SecurityControlsItem"
  }, /*#__PURE__*/React.isValidElement(message) ? message : /*#__PURE__*/React.createElement(FormattedMessage, message), tooltipMessage && /*#__PURE__*/React.createElement(Tooltip, {
    className: "bdl-SecurityControlsItem-tooltip",
    text: /*#__PURE__*/React.createElement(FormattedMessage, tooltipMessage),
    position: "middle-right",
    isTabbable: false
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdl-SecurityControlsItem-tooltipIcon"
  }, /*#__PURE__*/React.createElement(IconInfo, {
    color: bdlBoxBlue,
    width: ICON_SIZE,
    height: ICON_SIZE
  }))));
};
export default SecurityControlsItem;
//# sourceMappingURL=SecurityControlsItem.js.map