function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// // 
import * as React from 'react';
import classNames from 'classnames';
import ContentPreview from '../../elements/content-preview';
import Cache from '../../utils/Cache';
import MessagePreviewGhost from '../message-preview-ghost/MessagePreviewGhost';
import PreviewErrorNotification from './PreviewErrorNotification';
import './styles/MessagePreviewContent.scss';
const apiCache = new Cache();
function MessagePreviewContent({
  contentPreviewProps,
  fileId,
  sharedLink,
  getToken,
  className = '',
  apiHost
}) {
  const [isPreviewLoaded, setIsPreviewLoaded] = React.useState(false);
  const [isPreviewInErrorState, setIsPreviewInErrorState] = React.useState(false);
  const previewRef = React.useRef(null);
  React.useEffect(() => {
    setIsPreviewLoaded(false);
    setIsPreviewInErrorState(false);
  }, [fileId]);
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('MessagePreviewContent', className)
  }, isPreviewLoaded ? null : /*#__PURE__*/React.createElement(MessagePreviewGhost, null), isPreviewInErrorState ? /*#__PURE__*/React.createElement(PreviewErrorNotification, null) : /*#__PURE__*/React.createElement(ContentPreview, _extends({}, contentPreviewProps, {
    apiHost: apiHost,
    cache: apiCache,
    className: classNames({
      'MessagePreviewContent is-loading': !isPreviewLoaded
    }),
    componentRef: previewRef,
    fileId: fileId,
    onError: () => {
      setIsPreviewLoaded(true);
      setIsPreviewInErrorState(true);
    },
    onLoad: () => {
      if (previewRef.current) {
        previewRef.current.getViewer().disableViewerControls();
        setIsPreviewLoaded(true);
      }
    },
    sharedLink: sharedLink,
    token: () => getToken(fileId)
  })));
}
export default MessagePreviewContent;
//# sourceMappingURL=MessagePreviewContent.js.map