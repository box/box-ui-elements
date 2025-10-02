import * as React from 'react';
import { useIntl } from 'react-intl';
import { LoadingIndicator } from '@box/blueprint-web';
import { IconCtaIconHover, Size5 } from '@box/blueprint-web-assets/tokens/tokens';
import { XMark } from '@box/blueprint-web-assets/icons/Fill';
import messages from '../common/messages';
const IconInProgress = /*#__PURE__*/React.forwardRef(() => {
  const {
    formatMessage
  } = useIntl();
  return /*#__PURE__*/React.createElement("div", {
    className: "bcu-IconInProgress"
  }, /*#__PURE__*/React.createElement(XMark, {
    color: IconCtaIconHover,
    height: Size5,
    width: Size5
  }), /*#__PURE__*/React.createElement(LoadingIndicator, {
    "aria-label": formatMessage(messages.loading),
    className: "bcu-IconInProgress-loading"
  }));
});
IconInProgress.displayName = 'IconInProgress';
export default IconInProgress;
//# sourceMappingURL=IconInProgress.js.map