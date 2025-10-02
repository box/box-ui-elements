import * as React from 'react';
import LoadingIndicatorWrapper from './LoadingIndicatorWrapper';
import notes from './LoadingIndicatorWrapper.stories.md';

/* eslint-disable jsx-a11y/media-has-caption */
export const regular = () => /*#__PURE__*/React.createElement(LoadingIndicatorWrapper, {
  isLoading: true
}, /*#__PURE__*/React.createElement("video", {
  src: "//cdn03.boxcdn.net/sites/default/files/homepage/v2/images/hero/run/laptop-screen-1680-v2@1x.mp4",
  width: "100%"
}));
/* eslint-enable jsx-a11y/media-has-caption */

export default {
  title: 'Components/LoadingIndicatorWrapper',
  component: LoadingIndicatorWrapper,
  parameters: {
    notes
  }
};
//# sourceMappingURL=LoadingIndicatorWrapper.stories.js.map