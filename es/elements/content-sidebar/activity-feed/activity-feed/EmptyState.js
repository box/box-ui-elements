/**
 * 
 * @file Component for Activity feed empty state
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ActivityFeedEmptyStateIllustration from '../illustrations/ActivityFeedEmptyStateIllustration';
import EmptyStatePreviewActivity140 from '../../../../illustration/EmptyStatePreviewActivity140';
import messages from '../../../common/messages';
import './EmptyState.scss';
const EmptyState = ({
  showAnnotationMessage,
  showCommentMessage
}) => {
  const showActionMessage = showAnnotationMessage || showCommentMessage;
  const actionMessage = showAnnotationMessage ? messages.noActivityAnnotationPrompt : messages.noActivityCommentPrompt;
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-EmptyState"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcs-EmptyState-illustration"
  }, showAnnotationMessage ? /*#__PURE__*/React.createElement(ActivityFeedEmptyStateIllustration, null) : /*#__PURE__*/React.createElement(EmptyStatePreviewActivity140, null)), /*#__PURE__*/React.createElement("div", {
    className: "bcs-EmptyState-cta"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.noActivity, text => /*#__PURE__*/React.createElement("span", {
    className: "bcs-EmptyState-cta-detail"
  }, text)), showActionMessage && /*#__PURE__*/React.createElement("aside", {
    className: "bcs-EmptyState-cta-message"
  }, /*#__PURE__*/React.createElement(FormattedMessage, actionMessage))));
};
export default EmptyState;
//# sourceMappingURL=EmptyState.js.map