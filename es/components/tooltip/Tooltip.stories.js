import * as React from 'react';
import Button from '../button/Button';
import Tooltip, { TooltipPosition, TooltipTheme } from './Tooltip';
import notes from './Tooltip.stories.md';
const addSpacing = component => /*#__PURE__*/React.createElement("div", {
  style: {
    textAlign: 'center',
    marginTop: '125px',
    marginBottom: '125px'
  }
}, component);
export const positioning = () => {
  return addSpacing(/*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Tooltip, {
    isShown: true,
    position: TooltipPosition.TOP_CENTER,
    text: "tooltips are constrained to window by default so if you scroll until there is no room for this tooltip above the button, it will flip below the button"
  }, /*#__PURE__*/React.createElement(Button, null, "top center"))));
};
positioning.story = {
  name: 'Positioning'
};
export const themes = () => {
  return addSpacing(/*#__PURE__*/React.createElement(Tooltip, {
    isShown: true,
    position: TooltipPosition.TOP_RIGHT,
    text: "Theme this tooltip",
    theme: TooltipTheme.CALLOUT
  }, /*#__PURE__*/React.createElement(Button, null, "Theme Option: callout")));
};
themes.story = {
  name: 'Themes'
};
export const withCloseButton = () => {
  return addSpacing(/*#__PURE__*/React.createElement(Tooltip, {
    isShown: true,
    position: TooltipPosition.TOP_CENTER,
    showCloseButton: true,
    text: "Tooltips can have a close button and still work even if the text is long and wrapping",
    theme: TooltipTheme.DEFAULT
  }, /*#__PURE__*/React.createElement(Button, null, "Learn more")));
};
withCloseButton.story = {
  name: 'With close button'
};
export const isShown = () => addSpacing(/*#__PURE__*/React.createElement(Tooltip, {
  isShown: true,
  text: "Force show or hide"
}, /*#__PURE__*/React.createElement(Button, null, "Learn more")));
isShown.story = {
  name: 'Force show and hide'
};
export const withOffset = () => {
  return addSpacing(/*#__PURE__*/React.createElement(Tooltip, {
    isShown: true,
    position: TooltipPosition.MIDDLE_LEFT,
    text: "this tooltip has 20px offset",
    offset: "0 20px"
  }, /*#__PURE__*/React.createElement(Button, null, "Learn more")));
};
withOffset.story = {
  name: 'With offset'
};
export const withDisabled = () => addSpacing(/*#__PURE__*/React.createElement(Tooltip, {
  isDisabled: true,
  position: TooltipPosition.MIDDLE_RIGHT,
  text: "controlled tooltip that is shown based only on the isDisabled prop"
}, /*#__PURE__*/React.createElement(Button, null, "Learn more")));
withDisabled.story = {
  name: 'With disabled tooltip'
};
export const attachedToDisabledButton = () => addSpacing(/*#__PURE__*/React.createElement(Tooltip, {
  text: "Tooltip works on disabled buttons"
}, /*#__PURE__*/React.createElement(Button, {
  isDisabled: true
}, "Save changes")));
attachedToDisabledButton.story = {
  name: 'Attached to disabled button'
};
export const withLongText = () => addSpacing(/*#__PURE__*/React.createElement(Tooltip, {
  position: TooltipPosition.MIDDLE_LEFT,
  text: "this is a long tooltip that will addSpacing past 200px width, add a tooltipClass to override"
}, /*#__PURE__*/React.createElement(Button, null, "Learn more")));
withLongText.story = {
  name: 'With long tooltip text'
};
export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Tooltip.stories.js.map