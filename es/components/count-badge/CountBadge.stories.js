import * as React from 'react';
import CountBadge from './CountBadge';
import notes from './CountBadge.stories.md';
export const withAnimation = () => /*#__PURE__*/React.createElement(CountBadge, {
  isVisible: true,
  shouldAnimate: true,
  value: "1"
});
export const withoutAnimation = () => /*#__PURE__*/React.createElement(CountBadge, {
  isVisible: true,
  value: "3,000"
});
export const withHTMLSymbol1 = () => /*#__PURE__*/React.createElement(CountBadge, {
  isVisible: true,
  value: String.fromCharCode(8226)
});
export const withHTMLSymbol2 = () => /*#__PURE__*/React.createElement(CountBadge, {
  isVisible: true,
  value: String.fromCharCode(215)
});
export default {
  title: 'Components/Badges/CountBadge',
  component: CountBadge,
  parameters: {
    notes
  }
};
//# sourceMappingURL=CountBadge.stories.js.map