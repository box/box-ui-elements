import * as React from 'react';
import RadioButton from '../radio/RadioButton';
import RadioGroup from '../radio/RadioGroup';
import Fieldset from './Fieldset';
import notes from './Fieldset.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(Fieldset, {
  title: "Choose your favorite dessert"
}, /*#__PURE__*/React.createElement(RadioGroup, {
  name: "nodeType",
  value: "cupcakes"
}, /*#__PURE__*/React.createElement(RadioButton, {
  label: "Apple Pie",
  value: "applePie"
}), /*#__PURE__*/React.createElement(RadioButton, {
  label: "Cheesecake",
  value: "cheesecake"
}), /*#__PURE__*/React.createElement(RadioButton, {
  label: "Cupcakes",
  value: "cupcakes"
}), /*#__PURE__*/React.createElement(RadioButton, {
  label: "Macarons",
  value: "macarons"
}), /*#__PURE__*/React.createElement(RadioButton, {
  label: "Tiramisu",
  value: "tiramisu"
})));
export default {
  title: 'Components/Fieldset',
  component: Fieldset,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Fieldset.stories.js.map