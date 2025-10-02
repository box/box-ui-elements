import * as React from 'react';
import Button, { ButtonType } from '../button/Button';

// @ts-ignore flow import
import testImageSrc from './getTestImageSrc';
import ImageTooltip from './ImageTooltip';
import notes from './ImageTooltip.stories.md';
export const basic = () => /*#__PURE__*/React.createElement("div", {
  style: {
    textAlign: 'center'
  }
}, /*#__PURE__*/React.createElement(ImageTooltip, {
  content: "Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Ut at semper nisl.",
  image: /*#__PURE__*/React.createElement("img", {
    src: testImageSrc,
    alt: "Lorem ipsum dolor"
  }),
  isShown: true,
  title: "Lorem ipsum dolor"
}, /*#__PURE__*/React.createElement(Button, {
  type: ButtonType.BUTTON
}, "Callout")));
export default {
  title: 'Components/ImageTooltip',
  component: ImageTooltip,
  parameters: {
    notes
  }
};
//# sourceMappingURL=ImageTooltip.stories.js.map