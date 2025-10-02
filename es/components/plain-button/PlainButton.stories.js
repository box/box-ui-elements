import * as React from 'react';
import Icon from '../../icons/general/IconCopy';
import * as vars from '../../styles/variables';
import PlainButton from './PlainButton';
import { ButtonType } from '../button';
import notes from './PlainButton.stories.md';
export const regular = () => /*#__PURE__*/React.createElement(PlainButton, {
  type: ButtonType.BUTTON
}, "Click Here");
export const disabled = () => /*#__PURE__*/React.createElement(PlainButton, {
  isDisabled: true
}, "Click Here");
export const fixingMargins = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  style: {
    backgroundColor: vars.bdlLightBlue20,
    display: 'inline-block'
  }
}, /*#__PURE__*/React.createElement(PlainButton, null, /*#__PURE__*/React.createElement(Icon, null))), /*#__PURE__*/React.createElement("p", null, "By default the PlainButton component has margins set to 0."), /*#__PURE__*/React.createElement("style", null, `
                .bdl-SpecialButtonBug {
                    margin: 8px;
                }
            `), /*#__PURE__*/React.createElement("p", {
  style: {
    backgroundColor: vars.bdlWatermelonRed10,
    display: 'inline-block'
  }
}, /*#__PURE__*/React.createElement(PlainButton, {
  className: "bdl-SpecialButtonBug"
}, /*#__PURE__*/React.createElement(Icon, null))), /*#__PURE__*/React.createElement("p", null, "The layout jumps on hover if margin overrides are not set for the :active and :hover states.", /*#__PURE__*/React.createElement("pre", null, /*#__PURE__*/React.createElement("code", null, `
            .bdl-SpecialButtonBug {
                margin: $bdl-grid-unit*2;
            }
                `))), /*#__PURE__*/React.createElement("style", null, `
                .bdl-SpecialButtonFix,
                .bdl-SpecialButtonFix:hover,
                .bdl-SpecialButtonFix:active {
                    margin: 8px;
                }
            `), /*#__PURE__*/React.createElement("p", {
  style: {
    backgroundColor: vars.bdlGreenLight10,
    display: 'inline-block'
  }
}, /*#__PURE__*/React.createElement(PlainButton, {
  className: "bdl-SpecialButtonFix"
}, /*#__PURE__*/React.createElement(Icon, null))), /*#__PURE__*/React.createElement("p", null, "Workaround - use bdl-Button-margins mixin to define margins.", /*#__PURE__*/React.createElement("pre", null, /*#__PURE__*/React.createElement("code", null, `
            .bdl-SpecialButtonFix {
                @include bdl-Button-margins($bdl-grid-unit*2);
            }
                `))), /*#__PURE__*/React.createElement("style", null, `
                .bdl-SpecialButtonFix2,
                .bdl-SpecialButtonFix2:hover,
                .bdl-SpecialButtonFix2:active {
                    margin: 8px 12px 0 16px;
                }
            `), /*#__PURE__*/React.createElement("p", {
  style: {
    backgroundColor: vars.bdlGreenLight10,
    display: 'inline-block'
  }
}, /*#__PURE__*/React.createElement(PlainButton, {
  className: "bdl-SpecialButtonFix2"
}, /*#__PURE__*/React.createElement(Icon, null))), /*#__PURE__*/React.createElement("p", null, "You can set all 4 margins inline using shorthand property syntax.", /*#__PURE__*/React.createElement("pre", null, /*#__PURE__*/React.createElement("code", null, `
            .bdl-SpecialButtonFix2 {
                @include bdl-Button-margins($bdl-grid-unit*2 $bdl-grid-unit*3 0 $bdl-grid-unit*4);
            }
                `))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Why not fix this?"), " We will eventually, but since this behavior is relied upon in many places it is a breaking change that needs to be rolled out strategically."));
export default {
  title: 'Components/Buttons/PlainButton',
  component: PlainButton,
  parameters: {
    notes
  }
};
//# sourceMappingURL=PlainButton.stories.js.map