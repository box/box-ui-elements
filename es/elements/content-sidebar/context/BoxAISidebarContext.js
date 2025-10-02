import * as React from 'react';
import noop from 'lodash/noop';
export const BoxAISidebarContext = /*#__PURE__*/React.createContext({
  cache: null,
  contentName: '',
  elementId: '',
  fileExtension: '',
  isFeedbackEnabled: false,
  isFeedbackFormEnabled: false,
  isStopResponseEnabled: false,
  items: [],
  recordAction: noop,
  setCacheValue: noop,
  shouldFeedbackFormIncludeFeedbackText: false,
  shouldPreinitSession: true
});
//# sourceMappingURL=BoxAISidebarContext.js.map