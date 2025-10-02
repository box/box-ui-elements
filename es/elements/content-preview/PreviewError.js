/**
 * 
 * @file Preview loading and error UI wrapper
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import IconFileDefault from '../../icon/content/FileDefault32';
import SecurityBlockedState from '../../icons/states/SecurityBlockedState';
import messages from '../common/messages';
import { ERROR_CODE_FETCH_FILE_DUE_TO_POLICY } from '../../constants';
import './PreviewError.scss';
export default function PreviewError({
  errorCode
}) {
  const isBlockedByPolicy = errorCode === ERROR_CODE_FETCH_FILE_DUE_TO_POLICY;
  const message = isBlockedByPolicy ? messages.previewErrorBlockedByPolicy : messages.previewError;
  const icon = isBlockedByPolicy ? /*#__PURE__*/React.createElement(SecurityBlockedState, null) : /*#__PURE__*/React.createElement(IconFileDefault, {
    height: 160,
    width: 160
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "bcpr-PreviewError"
  }, icon, /*#__PURE__*/React.createElement("div", {
    className: "bcpr-PreviewError-message"
  }, /*#__PURE__*/React.createElement(FormattedMessage, message)));
}
//# sourceMappingURL=PreviewError.js.map