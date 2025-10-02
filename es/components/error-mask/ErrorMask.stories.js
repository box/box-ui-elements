import * as React from 'react';
import ErrorMask from './ErrorMask';
import notes from './ErrorMask.stories.md';
export const regular = () => /*#__PURE__*/React.createElement(ErrorMask, {
  errorHeader: "Apologies, we were unable to load this. But you can try what's mentioned below or just give up. No shame in giving up.",
  errorSubHeader: "Please refresh the page or try again later. And if it still doesn't work, then contact support. And if you can't contact support, post on our community forums."
});
export default {
  title: 'Components/ErrorMask',
  component: ErrorMask,
  parameters: {
    notes
  }
};
//# sourceMappingURL=ErrorMask.stories.js.map