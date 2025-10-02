import * as React from 'react';
import FooterIndicator from './FooterIndicator';
import notes from './FooterIndicator.stories.md';
export const regular = () => /*#__PURE__*/React.createElement("div", {
  style: {
    height: '250px',
    position: 'relative',
    transform: 'translate3d(0, 0, 0)'
  }
}, /*#__PURE__*/React.createElement(FooterIndicator, {
  indicatorText: "FooterIndicator"
}));
export const withTruncatedText = () => /*#__PURE__*/React.createElement("div", {
  style: {
    height: '250px',
    position: 'relative',
    transform: 'translate3d(0, 0, 0)'
  }
}, /*#__PURE__*/React.createElement(FooterIndicator, {
  indicatorText: "FooterIndicatorWithExtremelyRemarkablyStupendouslyTerrificallyLongName"
}));
export default {
  title: 'Components/FooterIndicator',
  component: FooterIndicator,
  parameters: {
    notes
  }
};
//# sourceMappingURL=FooterIndicator.stories.js.map