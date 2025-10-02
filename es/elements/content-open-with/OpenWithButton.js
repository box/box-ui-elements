function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Open With button
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';
import Button from '../../components/button/Button';
import IconOpenWith from '../../icons/general/IconOpenWith';
import Tooltip from '../common/Tooltip';
import messages from '../common/messages';
import OpenWithButtonContents from './OpenWithButtonContents';
import utils from './openWithUtils';
import { CLASS_INTEGRATION_ICON, OPEN_WITH_BUTTON_ICON_SIZE } from '../../constants';
import getIcon from './IconFileMap';
/**
 * Gets the tooltip text for the ContentOpenWith button
 *
 * @private
 * @return {?(string | Element)} the tooltip message
 */
export const getTooltip = (displayDescription, isLoading, error, disabledReasons = []) => {
  if (isLoading) {
    return null;
  }
  let message = /*#__PURE__*/React.createElement(FormattedMessage, messages.emptyOpenWithDescription);
  if (disabledReasons.length > 0) {
    [message] = disabledReasons;
  } else if (error) {
    message = /*#__PURE__*/React.createElement(FormattedMessage, messages.errorOpenWithDescription);
  } else if (displayDescription) {
    message = displayDescription;
  }
  return message;
};
const OpenWithButton = ({
  error,
  onClick = noop,
  displayIntegration,
  isLoading
}) => {
  const {
    displayName,
    isDisabled: isDisplayIntegrationDisabled,
    extension,
    disabledReasons,
    displayDescription
  } = displayIntegration || {};
  const isDisabled = !!isDisplayIntegrationDisabled || !displayName;
  const Icon = displayName ? getIcon(displayName) : IconOpenWith;
  const tooltipDisplayProps = utils.isDisabledBecauseBoxToolsIsNotInstalled(displayIntegration) ? {
    isShown: true,
    showCloseButton: true
  } : {};
  return /*#__PURE__*/React.createElement(Tooltip, _extends({
    className: "bcow-tooltip",
    position: "bottom-center",
    text: getTooltip(displayDescription, isLoading, error, disabledReasons)
  }, tooltipDisplayProps), /*#__PURE__*/React.createElement(Button, {
    "data-testid": "singleintegrationbutton",
    isDisabled: isDisabled,
    onClick: () => displayIntegration ? onClick(displayIntegration) : noop
  }, /*#__PURE__*/React.createElement(OpenWithButtonContents, null, /*#__PURE__*/React.createElement(Icon, {
    className: CLASS_INTEGRATION_ICON,
    dimension: OPEN_WITH_BUTTON_ICON_SIZE,
    extension: extension,
    height: OPEN_WITH_BUTTON_ICON_SIZE,
    width: OPEN_WITH_BUTTON_ICON_SIZE
  }))));
};
export default OpenWithButton;
//# sourceMappingURL=OpenWithButton.js.map