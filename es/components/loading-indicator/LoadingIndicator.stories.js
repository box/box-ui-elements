import * as React from 'react';
import LoadingIndicator, { LoadingIndicatorSize } from './LoadingIndicator';
import notes from './LoadingIndicator.stories.md';
export const defaultSize = () => /*#__PURE__*/React.createElement(LoadingIndicator, null);
export const smallSize = () => /*#__PURE__*/React.createElement(LoadingIndicator, {
  size: LoadingIndicatorSize.SMALL
});
export const mediumSize = () => /*#__PURE__*/React.createElement(LoadingIndicator, {
  size: LoadingIndicatorSize.MEDIUM
});
export const largeSize = () => /*#__PURE__*/React.createElement(LoadingIndicator, {
  size: LoadingIndicatorSize.LARGE
});
export default {
  title: 'Components/LoadingIndicator',
  component: LoadingIndicator,
  parameters: {
    notes
  }
};
//# sourceMappingURL=LoadingIndicator.stories.js.map