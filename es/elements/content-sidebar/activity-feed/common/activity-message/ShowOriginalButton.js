/**
 * 
 * @file Show Original button component used by Comment Text component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../../../../components/plain-button';
import messages from './messages';
const ShowOriginalButton = ({
  handleShowOriginal
}) => /*#__PURE__*/React.createElement(PlainButton, {
  className: "bcs-ActivityMessage-translate",
  onClick: handleShowOriginal
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.activityMessageShowOriginal));
export default ShowOriginalButton;
//# sourceMappingURL=ShowOriginalButton.js.map