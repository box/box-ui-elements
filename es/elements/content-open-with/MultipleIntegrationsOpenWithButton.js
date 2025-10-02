function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Open With button when multiple integrations are present
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import MenuToggle from '../../components/dropdown-menu/MenuToggle';
import IconOpenWith from '../../icons/general/IconOpenWith';
import Button from '../../components/button/Button';
import Tooltip from '../common/Tooltip';
import messages from '../common/messages';
import OpenWithButtonContents from './OpenWithButtonContents';
import { CLASS_INTEGRATION_ICON, OPEN_WITH_BUTTON_ICON_SIZE } from '../../constants';
const MultipleIntegrationsOpenWithButton = buttonProps => /*#__PURE__*/React.createElement(Tooltip, {
  position: "middle-left",
  text: /*#__PURE__*/React.createElement(FormattedMessage, messages.defaultOpenWithDescription)
}, /*#__PURE__*/React.createElement(Button, _extends({
  "data-testid": "multipleintegrationsbutton"
}, buttonProps), /*#__PURE__*/React.createElement(MenuToggle, null, /*#__PURE__*/React.createElement(OpenWithButtonContents, null, /*#__PURE__*/React.createElement(IconOpenWith, {
  className: CLASS_INTEGRATION_ICON,
  dimension: OPEN_WITH_BUTTON_ICON_SIZE,
  height: OPEN_WITH_BUTTON_ICON_SIZE,
  width: OPEN_WITH_BUTTON_ICON_SIZE
})))));
export default MultipleIntegrationsOpenWithButton;
//# sourceMappingURL=MultipleIntegrationsOpenWithButton.js.map