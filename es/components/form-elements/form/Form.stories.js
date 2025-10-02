/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import Button from '../../button/Button';
import Select from '../../select/Select';
import TextArea from '../text-area/TextArea';
import TextInput from '../text-input/TextInput';
import Toggle from '../../toggle/Toggle';
import Form from './Form';
import notes from './Form.stories.md';
export const basic = () => {
  const [formData, setFormData] = React.useState({
    showtextareatoggle: ''
  });
  const [formValidityState, setFormValidityState] = React.useState({});
  const customValidationFunc = value => {
    if (value !== 'box') {
      return {
        code: 'notbox',
        message: 'value is not box'
      };
    }
    return null;
  };
  return /*#__PURE__*/React.createElement(Form, {
    onChange: _formData => {
      setFormValidityState({});
      setFormData(_formData);
    },
    onValidSubmit: () => {
      // On a server validation error, set formValidityState to
      // push error states to child inputs

      setFormValidityState({
        username: {
          code: 'usernametaken',
          message: 'Username already taken.'
        }
      });
    }
    /* eslint-disable-next-line no-console */,
    onInvalidSubmit: _formValidityState => console.log(_formValidityState),
    formValidityState: formValidityState
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TextInput, {
    name: "username",
    label: "Username",
    placeholder: "swagmaster6",
    type: "text",
    isRequired: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TextInput, {
    name: "email",
    label: "Email Address",
    placeholder: "user@example.com",
    type: "email"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TextInput, {
    label: "Must say box",
    name: "customValidationFunc",
    placeholder: "Not box",
    type: "text",
    validation: customValidationFunc
  })), /*#__PURE__*/React.createElement(Select, {
    name: "albumselect",
    label: "Album"
  }, /*#__PURE__*/React.createElement("option", {
    value: 1
  }, "Illmatic"), /*#__PURE__*/React.createElement("option", {
    value: 2
  }, "The Marshall Mathers LP"), /*#__PURE__*/React.createElement("option", {
    value: 3
  }, "All Eyez on Me"), /*#__PURE__*/React.createElement("option", {
    value: 4
  }, "Ready To Die"), /*#__PURE__*/React.createElement("option", {
    value: 5
  }, "Enter the Wu-Tang"), /*#__PURE__*/React.createElement("option", {
    value: 6
  }, "The Eminem Show"), /*#__PURE__*/React.createElement("option", {
    value: 7
  }, "The Chronic"), /*#__PURE__*/React.createElement("option", {
    value: 8
  }, "Straight Outta Compton"), /*#__PURE__*/React.createElement("option", {
    value: 9
  }, "Reasonable Doubt")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Toggle, {
    name: "showtextareatoggle",
    id: "showtextareatoggle",
    isOn: formData.showtextareatoggle === 'on',
    label: "Show TextArea",
    onChange: () => null
  })), formData.showtextareatoggle === 'on' ? /*#__PURE__*/React.createElement(TextArea, {
    name: "textarea",
    label: "Your story",
    placeholder: "Once upon a time"
  }) : null), /*#__PURE__*/React.createElement(Button, {
    type: "submit"
  }, "Submit"));
};
export default {
  title: 'Components/Form Elements/Form',
  component: Form,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Form.stories.js.map