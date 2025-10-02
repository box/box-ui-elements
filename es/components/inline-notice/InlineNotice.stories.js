import * as React from 'react';
import InlineNotice from './InlineNotice';
import notes from './InlineNotice.stories.md';
export const withoutTitle = () => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InlineNotice, {
  type: "warning"
}, "This is a ", /*#__PURE__*/React.createElement("strong", null, "warning"), " notice. You might want to pay attention to this."), /*#__PURE__*/React.createElement(InlineNotice, {
  type: "error"
}, "This is an ", /*#__PURE__*/React.createElement("strong", null, "error"), " notice. You really want to pay attention to this."), /*#__PURE__*/React.createElement(InlineNotice, {
  type: "success"
}, "This is a ", /*#__PURE__*/React.createElement("strong", null, "success"), " notice. You ought to feel really good about this."), /*#__PURE__*/React.createElement(InlineNotice, {
  type: "info"
}, "This is an ", /*#__PURE__*/React.createElement("strong", null, "info"), " notice. You should get some context from this."), /*#__PURE__*/React.createElement(InlineNotice, {
  type: "generic"
}, "This is an ", /*#__PURE__*/React.createElement("strong", null, "generic"), " notice. You will just want to see this."));
export const withTitle = () => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InlineNotice, {
  type: "warning",
  title: "Warning Title"
}, "This is a warning notice. You might want to pay attention to this."), /*#__PURE__*/React.createElement(InlineNotice, {
  type: "error",
  title: "Error Title"
}, "This is an error notice. You really want to pay attention to this."), /*#__PURE__*/React.createElement(InlineNotice, {
  type: "success",
  title: "Success Title"
}, "This is a success notice. You ought to feel really good about this."), /*#__PURE__*/React.createElement(InlineNotice, {
  type: "info",
  title: "Info Title"
}, "This is an info notice. You should get some context from this."), /*#__PURE__*/React.createElement(InlineNotice, {
  type: "generic",
  title: "Generic Title"
}, "This is a generic notice. You will just want to notice this."));
export default {
  title: 'Components/InlineNotice',
  component: InlineNotice,
  parameters: {
    notes
  }
};
//# sourceMappingURL=InlineNotice.stories.js.map