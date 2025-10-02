function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import PlainButton from '../../../../components/plain-button';
import './RepliesToggle.scss';
const RepliesToggle = ({
  onShowReplies,
  onHideReplies,
  repliesShownCount,
  repliesTotalCount
}) => {
  if (repliesTotalCount <= 1) {
    return null;
  }
  const hasMoreRepliesToShow = repliesTotalCount > repliesShownCount;
  const toggleMessage = hasMoreRepliesToShow ? messages.showReplies : messages.hideReplies;
  const repliesToLoadCount = Math.max(repliesTotalCount - repliesShownCount, 0);
  const handleToggle = () => {
    if (hasMoreRepliesToShow) {
      onShowReplies();
    } else if (repliesShownCount) {
      onHideReplies(repliesShownCount - 1);
    }
  };
  return /*#__PURE__*/React.createElement(PlainButton, {
    className: "bcs-RepliesToggle",
    onClick: handleToggle,
    type: "button",
    "data-testid": "replies-toggle"
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    values: {
      repliesToLoadCount
    }
  }, toggleMessage)));
};
export default RepliesToggle;
//# sourceMappingURL=RepliesToggle.js.map