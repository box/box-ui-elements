import * as React from 'react';
import { useIntl } from 'react-intl';
import { InlineNotice } from '@box/blueprint-web';
import messages from '../messages';
const ContentExplorerInfoNotice = ({
  infoNoticeText
}) => {
  const {
    formatMessage
  } = useIntl();
  return /*#__PURE__*/React.createElement(InlineNotice, {
    variant: "info",
    variantIconAriaLabel: formatMessage(messages.infoNoticeIconAriaLabel)
  }, infoNoticeText);
};
export default ContentExplorerInfoNotice;
//# sourceMappingURL=ContentExplorerInfoNotice.js.map