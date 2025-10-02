/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import Toggle from './Toggle';
import notes from './Toggle.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(Toggle, {
  name: "toggle1",
  label: "Uncontrolled toggle",
  description: "isOn is undefined, which makes this an uncontrolled component. You can turn this one on or off whenever you want."
});
export const rightAligned = () => /*#__PURE__*/React.createElement(Toggle, {
  description: "isOn is undefined, which makes this an uncontrolled component. You can turn this one on or off whenever you want.",
  isToggleRightAligned: true,
  label: "Uncontrolled toggle right aligned",
  name: "toggle1"
});
export const controlled = () => {
  const [isOn, setIsOn] = React.useState(false);
  const onToggle = () => setIsOn(!isOn);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Toggle, {
    name: "toggle2",
    label: "Controlled toggle",
    isOn: isOn,
    onChange: onToggle,
    description: "This is a controlled component."
  }), /*#__PURE__*/React.createElement(Toggle, {
    name: "toggle3",
    label: "Inverted controlled toggle",
    isOn: !isOn,
    onChange: onToggle,
    description: "This is a controlled component, whose value is the inverse of the one above."
  }));
};
export const disabled = () => /*#__PURE__*/React.createElement(Toggle, {
  name: "toggle4",
  label: "Disabled",
  isDisabled: true
});
export default {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Toggle.stories.js.map