function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Base class for the Content Preview ES6 wrapper
 * @author Box
 */

import * as React from 'react';
// TODO switch to createRoot when upgrading to React 18
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import ContentPreviewResponsive from '../content-preview';
class ContentPreview extends ES6Wrapper {
  /**
   * Helper to programmatically refresh the preview's sidebar panel
   * @returns {void}
   */
  refreshSidebar() {
    this.getComponent().refreshSidebar();
  }

  /** @inheritdoc */
  render() {
    render(/*#__PURE__*/React.createElement(ContentPreviewResponsive, _extends({
      componentRef: this.setComponent,
      fileId: this.id,
      language: this.language,
      messages: this.messages,
      onInteraction: this.onInteraction,
      token: this.token
    }, this.options)), this.container);
  }
}
global.Box = global.Box || {};
global.Box.ContentPreview = ContentPreview;
export default ContentPreview;
//# sourceMappingURL=ContentPreview.js.map