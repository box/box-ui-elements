import * as React from 'react';
import { bdlGray20, bdlPurpleRain } from '../../../styles/variables';
import RadioButton from '../RadioButton';
import RadioGroup from '../RadioGroup';
import notes from './RadioGroup.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(RadioGroup, {
  name: "radiogroup",
  value: "radio3"
}, /*#__PURE__*/React.createElement(RadioButton, {
  label: "Radio Button 1",
  value: "radio1",
  description: "I have a description"
}), /*#__PURE__*/React.createElement(RadioButton, {
  label: "Radio Button 2",
  value: "radio2",
  description: "I also have a description"
}), /*#__PURE__*/React.createElement(RadioButton, {
  label: "Radio Button 3",
  value: "radio3"
}), /*#__PURE__*/React.createElement(RadioButton, {
  label: "Radio Button 4",
  value: "radio4"
}), /*#__PURE__*/React.createElement(RadioButton, {
  label: "Disabled Radio Button",
  value: "radio5",
  isDisabled: true
}));
export const withCustomRadioButtonComponent = () => {
  const CustomRadioButton = ({
    isSelected,
    label,
    name,
    value
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      marginRight: '15px',
      position: 'relative'
    },
    title: String(label)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: isSelected ? bdlPurpleRain : bdlGray20,
      borderRadius: '50%',
      display: 'inline-block',
      height: '20px',
      left: '0',
      position: 'absolute',
      width: '20px'
    }
  }), /*#__PURE__*/React.createElement("input", {
    checked: isSelected,
    name: name,
    type: "radio",
    value: value,
    style: {
      cursor: 'pointer',
      height: '20px',
      opacity: 0,
      width: '20px'
    }
  }));
  return /*#__PURE__*/React.createElement(RadioGroup, {
    name: "customradiogroup",
    value: "customRadio3"
  }, /*#__PURE__*/React.createElement(CustomRadioButton, {
    label: "Radio Button 1",
    value: "customRadio1"
  }), /*#__PURE__*/React.createElement(CustomRadioButton, {
    label: "Radio Button 2",
    value: "customRadio2"
  }), /*#__PURE__*/React.createElement(CustomRadioButton, {
    label: "Radio Button 3",
    value: "customRadio3"
  }), /*#__PURE__*/React.createElement(CustomRadioButton, {
    label: "Radio Button 4",
    value: "customRadio4"
  }), /*#__PURE__*/React.createElement(CustomRadioButton, {
    label: "Radio Button 5",
    value: "customRadio5"
  }));
};
export default {
  title: 'Components/Radio/RadioGroup',
  component: RadioGroup,
  parameters: {
    notes
  }
};
//# sourceMappingURL=RadioGroup.stories.js.map