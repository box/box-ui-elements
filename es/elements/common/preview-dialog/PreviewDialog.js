function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { useIntl } from 'react-intl';
import Modal from 'react-modal';
import cloneDeep from 'lodash/cloneDeep';
import ContentPreview from '../../content-preview';
import { TYPE_FILE, CLASS_MODAL_CONTENT_FULL_BLEED, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../../constants';
import messages from '../messages';
const PreviewDialog = ({
  apiHost,
  appElement,
  appHost,
  cache,
  canDownload,
  contentPreviewProps,
  currentCollection,
  isOpen,
  item,
  onCancel,
  onDownload,
  onPreview,
  parentElement,
  previewLibraryVersion,
  requestInterceptor,
  responseInterceptor,
  sharedLink,
  sharedLinkPassword,
  staticHost,
  staticPath,
  token
}) => {
  const {
    formatMessage
  } = useIntl();
  const {
    items
  } = currentCollection;
  const onLoad = data => {
    onPreview(cloneDeep(data));
  };
  if (!item || !items) {
    return null;
  }
  const files = items.filter(({
    type
  }) => type === TYPE_FILE);
  return /*#__PURE__*/React.createElement(Modal, {
    appElement: appElement,
    className: CLASS_MODAL_CONTENT_FULL_BLEED,
    contentLabel: formatMessage(messages.preview),
    isOpen: isOpen,
    onRequestClose: onCancel,
    overlayClassName: CLASS_MODAL_OVERLAY,
    parentSelector: () => parentElement,
    portalClassName: CLASS_MODAL
  }, /*#__PURE__*/React.createElement(ContentPreview, _extends({}, contentPreviewProps, {
    autoFocus: true,
    apiHost: apiHost,
    appHost: appHost,
    cache: cache,
    canDownload: canDownload,
    collection: files,
    fileId: item.id,
    hasHeader: true,
    onClose: onCancel,
    onDownload: onDownload,
    onLoad: onLoad,
    previewLibraryVersion: previewLibraryVersion,
    staticHost: staticHost,
    staticPath: staticPath,
    sharedLink: sharedLink,
    sharedLinkPassword: sharedLinkPassword,
    requestInterceptor: requestInterceptor,
    responseInterceptor: responseInterceptor,
    token: token
  })));
};
export default PreviewDialog;
//# sourceMappingURL=PreviewDialog.js.map