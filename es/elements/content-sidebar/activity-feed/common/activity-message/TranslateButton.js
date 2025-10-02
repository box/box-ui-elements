/**
 * 
 * @file Translate button component used by Comment Text component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../../../../components/plain-button';
import messages from './messages';
const TranslateButton = ({
  handleTranslate
}) => /*#__PURE__*/React.createElement(PlainButton, {
  className: "bcs-ActivityMessage-translate",
  onClick: handleTranslate
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.activityMessageTranslate));
export default TranslateButton;
//# sourceMappingURL=TranslateButton.js.map