/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import TextInput from './TextInput';
import notes from './TextInput.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(TextInput, {
  label: "Email",
  name: "textinput",
  type: "email",
  placeholder: "Enter email here"
});
export const withDescription = () => /*#__PURE__*/React.createElement(TextInput, {
  description: "Email used for work",
  label: "Email",
  name: "textinput",
  type: "email",
  placeholder: "Enter email here"
});
export const withLongBreakableStrings = () => /*#__PURE__*/React.createElement(TextInput, {
  description: "Long Long Long Long long long Long Long Long Long long longLong Long Long Long long longLong Long Long Long long long",
  label: "Long Long Long Long long long Long Long Long Long long longLong Long Long Long long longLong Long Long Long long long",
  name: "textinput",
  type: "email",
  placeholder: "Enter email here"
});
export const withLongUnbreakableStrings = () => /*#__PURE__*/React.createElement(TextInput, {
  description: "longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
  label: "longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
  name: "textinput",
  type: "email",
  placeholder: "Enter email here"
});
export const error = () => /*#__PURE__*/React.createElement(TextInput, {
  label: "Email",
  name: "textinput",
  type: "email",
  error: "oops",
  placeholder: "Enter email here"
});
export const loading = () => /*#__PURE__*/React.createElement(TextInput, {
  label: "Email",
  name: "textinput",
  type: "email",
  isLoading: true,
  placeholder: "Enter email here"
});
export const valid = () => /*#__PURE__*/React.createElement(TextInput, {
  label: "Email",
  name: "textinput",
  type: "email",
  isValid: true,
  placeholder: "Enter email here"
});
export const requiredWithOnChange = () => {
  const [input, setInput] = React.useState({
    error: 'required',
    value: ''
  });
  return /*#__PURE__*/React.createElement(TextInput, {
    label: "Email",
    name: "textinput",
    type: "email",
    placeholder: "Enter email here",
    value: input.value,
    error: input.error,
    onChange: e => setInput({
      error: e.target.value ? '' : 'required',
      value: e.target.value
    })
  });
};
export default {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    notes
  }
};
//# sourceMappingURL=TextInput.stories.js.map