import * as React from 'react';
import { Field, Form, Formik } from 'formik';
import TextInput from '../../text-input/TextInput';
import TextArea from '../../text-area/TextAreaField';
import Toggle from '../../toggle/ToggleField';
import Checkbox from '../../checkbox/CheckboxField';
import SelectField from '../../select-field/SelectField';
import PillSelectorDropdownField from '../../pill-selector-dropdown/PillSelectorDropdownField';
import DatalistItem from '../../datalist-item/DatalistItem';
import { RadioButton, RadioButtonField, RadioGroup } from '../../radio';
import notes from './Formik.stories.md';
export const basic = () => {
  const pillSelectorValidator = option => {
    const value = typeof option === 'string' ? option : option.value;
    return ['red', 'green', 'blue', 'yellow', 'white', 'black'].includes(value);
  };
  return /*#__PURE__*/React.createElement(Formik, {
    initialValues: {
      checkbox: true,
      pillselector: [],
      radiogroup: 'red',
      textarea: 'textarea',
      textinput: 'textinput',
      toggle: true
    },
    onSubmit: () => null,
    validate: values => {
      const errors = {};
      const {
        textinput,
        textarea,
        pillselector
      } = values;
      if (!textinput) {
        errors.textinput = 'Required';
      }
      if (!textarea) {
        errors.textarea = 'Required';
      }
      if (Array.isArray(pillselector) && !pillselector.every(pill => pillSelectorValidator(pill))) {
        errors.pillselector = 'Bad colors';
      }
      return errors;
    }
  }, props => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Form, {
    style: {
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    name: "checkbox",
    label: "Checkbox Field",
    component: Checkbox
  }), /*#__PURE__*/React.createElement(Field, {
    name: "toggle",
    label: "Toggle Field",
    component: Toggle
  }), /*#__PURE__*/React.createElement(Field, {
    isRequired: true,
    label: "Text Input Field",
    name: "textinput",
    type: "text",
    placeholder: "Text Input Field",
    component: TextInput
  }), /*#__PURE__*/React.createElement(Field, {
    isRequired: true,
    label: "Text Area Field",
    name: "textarea",
    placeholder: "Text Area Field",
    component: TextArea
  }), /*#__PURE__*/React.createElement("b", null, "Non-RadioGroup RadioButtons sharing the same name"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Field, {
    isSelected: false,
    label: "Radio Button Field 1",
    name: "radiobutton",
    component: RadioButtonField,
    value: "radio1"
  }), /*#__PURE__*/React.createElement(Field, {
    isSelected: false,
    label: "Radio Button Field 2",
    name: "radiobutton",
    component: RadioButtonField,
    value: "radio2"
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Field, {
    label: "Single Select Field",
    name: "singleselect",
    placeholder: "Single Select Field",
    options: [{
      displayText: 'Red',
      value: 'red'
    }, {
      displayText: 'Green',
      value: 'green'
    }, {
      displayText: 'Blue',
      value: 'blue'
    }],
    component: SelectField
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Field, {
    label: "Multi Select Field",
    name: "multiselect",
    placeholder: "Multi Select Field",
    multiple: true,
    options: [{
      displayText: 'Red',
      value: 'red'
    }, {
      displayText: 'Green',
      value: 'green'
    }, {
      displayText: 'Blue',
      value: 'blue'
    }],
    component: SelectField
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", null, "RadioGroup-ed RadioButtons"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Field, {
    name: "radiogroup",
    component: RadioGroup
  }, /*#__PURE__*/React.createElement(RadioButton, {
    label: "Red",
    value: "red",
    description: "Red color"
  }), /*#__PURE__*/React.createElement(RadioButton, {
    label: "Blue",
    value: "blue",
    description: "Blue color"
  })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Field, {
    label: "Pill Selector Field",
    name: "pillselector",
    placeholder: "Colors",
    component: PillSelectorDropdownField,
    validator: pillSelectorValidator
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Field, {
    label: "Pill Selector Field With Dropdown",
    name: "pillselectordropdown",
    placeholder: "Colors",
    options: [{
      displayText: 'Red',
      value: 'red'
    }, {
      displayText: 'Green',
      value: 'green'
    }, {
      displayText: 'Blue',
      value: 'blue'
    }],
    component: PillSelectorDropdownField,
    validator: pillSelectorValidator,
    dropdownRenderer: options => options.map(option => /*#__PURE__*/React.createElement(DatalistItem, {
      key: option.value,
      style: {
        color: option.value
      }
    }, option.displayText))
  })), /*#__PURE__*/React.createElement("pre", {
    style: {
      color: '#fff',
      background: '#0061D5',
      fontSize: '14px',
      padding: '.5rem',
      float: 'right',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Formik State"), " = ", JSON.stringify(props, null, 2))));
};
export default {
  title: 'Components/Formik Elements',
  parameters: {
    notes
  }
};
//# sourceMappingURL=Formik.stories.js.map