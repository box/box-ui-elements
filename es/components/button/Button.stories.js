import * as React from 'react';
import { action } from 'storybook/actions';
import * as vars from '../../styles/variables';
import PrimaryButton from '../primary-button';
import Icon from '../../icon/line/Plus16';
import Icon2 from '../../icons/general/IconEllipsis';
// @ts-ignore flow import
import InlineNotice from '../inline-notice';
import Button from './Button';
import notes from './Button.stories.md';
export const regular = () => {
  return /*#__PURE__*/React.createElement(Button, {
    onClick: action('onClick called')
  }, "Click Here");
};
export const loading = () => /*#__PURE__*/React.createElement(Button, {
  isLoading: true
}, "Click Here");
export const disabled = () => /*#__PURE__*/React.createElement(Button, {
  isDisabled: true
}, "Click Here");
export const withRadar = () => /*#__PURE__*/React.createElement(Button, {
  showRadar: true
}, "Click Here");
export const large = () => /*#__PURE__*/React.createElement(Button, {
  size: "large"
}, "Click Here");
export const iconButton = () => /*#__PURE__*/React.createElement(Button, {
  icon: /*#__PURE__*/React.createElement(Icon2, {
    title: "Options"
  }),
  size: "large"
});
export const iconAndTextButton = () => /*#__PURE__*/React.createElement(Button, {
  icon: /*#__PURE__*/React.createElement(Icon, null),
  size: "large"
}, "Click Here");
export const fixingMargins = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InlineNotice, {
  type: "error",
  title: "Note"
}, "The PlainButton variant has a ", /*#__PURE__*/React.createElement("b", null, "margin of 0"), " and needs special handling due to how the margin is defined for ", /*#__PURE__*/React.createElement("b", null, "hover/active states"), ".", /*#__PURE__*/React.createElement("br", null), " The methods shown below will cause problems for PlainButton. See PlainButton docs for details."), /*#__PURE__*/React.createElement("p", null, "By default there are 5px margins on all sides of the Button and PrimaryButton components."), /*#__PURE__*/React.createElement("p", {
  style: {
    backgroundColor: vars.bdlGray10,
    display: 'inline-block'
  }
}, /*#__PURE__*/React.createElement(Button, null, "Cancel"), /*#__PURE__*/React.createElement(PrimaryButton, null, "Action")), /*#__PURE__*/React.createElement("p", null, "A quick fix to remove the margins is to add the ", /*#__PURE__*/React.createElement("code", null, "man"), " (margin-all-none) or ", /*#__PURE__*/React.createElement("code", null, "mrn"), "/", /*#__PURE__*/React.createElement("code", null, "mln"), "/", /*#__PURE__*/React.createElement("code", null, "mhn"), "/", /*#__PURE__*/React.createElement("code", null, "mvn"), " (right/left/horizontal/vertical) utility classes."), /*#__PURE__*/React.createElement("p", {
  style: {
    backgroundColor: vars.bdlGray10,
    display: 'inline-block'
  }
}, /*#__PURE__*/React.createElement(Button, {
  className: "mln"
}, "Cancel (mln)"), /*#__PURE__*/React.createElement(Button, {
  className: "mhn"
}, "Other (mhn)"), /*#__PURE__*/React.createElement(PrimaryButton, {
  className: "mrn"
}, "Action (mrn)")), /*#__PURE__*/React.createElement("p", null, "Alternately, you can create a CSS class and customize as needed.", /*#__PURE__*/React.createElement("pre", null, /*#__PURE__*/React.createElement("code", null, `
        .bdl-SpecialButton {
            margin: 0 $bdl-grid-unit;
        }
                    `))));
export default {
  title: 'Components/Buttons/Button',
  component: Button,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Button.stories.js.map