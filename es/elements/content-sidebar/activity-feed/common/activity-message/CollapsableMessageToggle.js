/**
 * 
 * @file Show more/less button
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../../../../components/plain-button';
import messages from './messages';
const CollapsableMessageToggle = ({
  isMore,
  onClick
}) => /*#__PURE__*/React.createElement(PlainButton, {
  className: "bcs-ActivityMessage-toggleMoreLess",
  onClick: onClick,
  type: "button"
}, /*#__PURE__*/React.createElement(FormattedMessage, isMore ? messages.activityMessageSeeMore : messages.activityMessageSeeLess));
export default CollapsableMessageToggle;
//# sourceMappingURL=CollapsableMessageToggle.js.map