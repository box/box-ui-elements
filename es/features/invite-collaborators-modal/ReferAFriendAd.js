import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Badge from '../../components/badge';
import { Link } from '../../components/link';
import messages from './messages';
import './ReferAFriendAd.scss';
const ReferAFriendAd = () => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
  type: "success"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.referAFriendBadgeText)), "\xA0\xA0", /*#__PURE__*/React.createElement(FormattedMessage, messages.referAFriendText), "\xA0", /*#__PURE__*/React.createElement(Link, {
  className: "refer-a-friend-reward-center-link",
  href: "/master/settings/rewardCenter",
  rel: "noopener noreferrer",
  target: "_blank"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.referAFriendRewardCenterLinkText)));
export default ReferAFriendAd;
//# sourceMappingURL=ReferAFriendAd.js.map