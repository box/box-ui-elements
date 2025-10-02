function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import * as React from 'react';
import Modal from 'react-modal';
import { injectIntl } from 'react-intl';
// $FlowFixMe
import ContentUploader from '../../content-uploader';
import messages from '../messages';
import { CLASS_MODAL_CONTENT_FULL_BLEED, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../../constants';
const UploadDialog = ({
  isOpen,
  currentFolderId,
  token,
  sharedLink,
  sharedLinkPassword,
  apiHost,
  uploadHost,
  onClose,
  parentElement,
  appElement,
  onUpload,
  contentUploaderProps,
  requestInterceptor,
  responseInterceptor,
  intl
}) => /*#__PURE__*/React.createElement(Modal, {
  appElement: appElement,
  className: CLASS_MODAL_CONTENT_FULL_BLEED,
  contentLabel: intl.formatMessage(messages.upload),
  isOpen: isOpen,
  onRequestClose: onClose,
  overlayClassName: CLASS_MODAL_OVERLAY,
  parentSelector: () => parentElement,
  portalClassName: `${CLASS_MODAL} be-modal-upload`
}, /*#__PURE__*/React.createElement(ContentUploader, _extends({}, contentUploaderProps, {
  apiHost: apiHost,
  onClose: onClose,
  onComplete: onUpload,
  requestInterceptor: requestInterceptor,
  responseInterceptor: responseInterceptor,
  rootFolderId: currentFolderId,
  sharedLink: sharedLink,
  sharedLinkPassword: sharedLinkPassword,
  token: token,
  uploadHost: uploadHost
})));
export default injectIntl(UploadDialog);
//# sourceMappingURL=UploadDialog.js.map