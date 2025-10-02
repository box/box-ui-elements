/**
 * 
 * @file Comment Input Controls components for CommentForm
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../../../components/button/Button';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import messages from './messages';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
const CommentInputControls = ({
  onCancel
}) => /*#__PURE__*/React.createElement("div", {
  className: "bcs-CommentFormControls"
}, /*#__PURE__*/React.createElement(Button, {
  "data-resin-target": ACTIVITY_TARGETS.APPROVAL_FORM_CANCEL,
  onClick: onCancel,
  type: "button"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.commentCancel)), /*#__PURE__*/React.createElement(PrimaryButton, {
  "data-resin-target": ACTIVITY_TARGETS.APPROVAL_FORM_POST
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.commentPost)));
export default CommentInputControls;
//# sourceMappingURL=CommentFormControls.js.map