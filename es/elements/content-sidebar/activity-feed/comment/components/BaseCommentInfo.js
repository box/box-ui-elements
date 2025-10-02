import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ACTIVITY_TARGETS } from '../../../../common/interactionTargets';
import { PLACEHOLDER_USER } from '../../../../../constants';
import ActivityTimestamp from '../../common/activity-timestamp';
import Avatar from '../../Avatar';
import IconAnnotation from '../../../../../icons/two-toned/IconAnnotation';
import UserLink from '../../common/user-link';
import messages from '../messages';
import './BaseCommentInfo.scss';
export const BaseCommentInfo = ({
  annotationActivityLink,
  created_at,
  created_by,
  getAvatarUrl,
  getUserProfileUrl
}) => {
  const createdByUser = created_by || PLACEHOLDER_USER;
  const createdAtTimestamp = new Date(created_at).getTime();
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-BaseCommentInfo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcs-BaseCommentInfo-avatar"
  }, /*#__PURE__*/React.createElement(Avatar, {
    badgeIcon: annotationActivityLink && /*#__PURE__*/React.createElement(IconAnnotation, {
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.inlineCommentAnnotationIconTitle)
    }),
    getAvatarUrl: getAvatarUrl,
    user: createdByUser
  })), /*#__PURE__*/React.createElement("div", {
    className: "bcs-BaseCommentInfo-data"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcs-Comment-headline"
  }, /*#__PURE__*/React.createElement(UserLink, {
    "data-resin-target": ACTIVITY_TARGETS.PROFILE,
    getUserProfileUrl: getUserProfileUrl,
    id: createdByUser.id,
    name: createdByUser.name
  })), /*#__PURE__*/React.createElement("div", {
    className: "bcs-BaseCommentInfo-data-timestamp"
  }, /*#__PURE__*/React.createElement(ActivityTimestamp, {
    date: createdAtTimestamp
  }), annotationActivityLink && /*#__PURE__*/React.createElement("div", {
    className: "bcs-BaseComment-AnnotationActivityLink"
  }, annotationActivityLink))));
};
//# sourceMappingURL=BaseCommentInfo.js.map