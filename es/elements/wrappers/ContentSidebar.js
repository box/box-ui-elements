function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Base class for the Content Sidebar ES6 wrapper
 * @author Box
 */

import * as React from 'react';
// TODO switch to createRoot when upgrading to React 18
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import ContentSidebarComponent from '../content-sidebar';
class ContentSidebar extends ES6Wrapper {
  /**
   * Helper to programmatically refresh the current sidebar panel
   * @returns {void}
   */
  refresh() {
    this.getComponent().refresh();
  }

  /** @inheritdoc */
  render() {
    render(/*#__PURE__*/React.createElement(ContentSidebarComponent, _extends({
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
global.Box.ContentSidebar = ContentSidebar;
export default ContentSidebar;
//# sourceMappingURL=ContentSidebar.js.map