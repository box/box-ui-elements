import * as React from 'react';
import RadarAnimation, { RadarAnimationPosition } from './RadarAnimation';
import Button from '../button';
import notes from './RadarAnimation.stories.md';
export const bottomLeft = () => /*#__PURE__*/React.createElement(RadarAnimation, {
  position: RadarAnimationPosition.BOTTOM_LEFT
}, /*#__PURE__*/React.createElement(Button, null, "Bottom Left"));
export const bottomCenter = () => /*#__PURE__*/React.createElement(RadarAnimation, {
  position: RadarAnimationPosition.BOTTOM_CENTER
}, /*#__PURE__*/React.createElement(Button, null, "Bottom Center"));
export const bottomRight = () => /*#__PURE__*/React.createElement(RadarAnimation, {
  position: RadarAnimationPosition.BOTTOM_RIGHT
}, /*#__PURE__*/React.createElement(Button, null, "Bottom Right"));
export const middleLeft = () => /*#__PURE__*/React.createElement(RadarAnimation, {
  position: RadarAnimationPosition.MIDDLE_LEFT
}, /*#__PURE__*/React.createElement(Button, null, "Middle Left"));
export const middleCenter = () => /*#__PURE__*/React.createElement(RadarAnimation, {
  position: RadarAnimationPosition.MIDDLE_CENTER
}, /*#__PURE__*/React.createElement(Button, null, "Middle Center"));
export const middleRight = () => /*#__PURE__*/React.createElement(RadarAnimation, {
  position: RadarAnimationPosition.MIDDLE_RIGHT
}, /*#__PURE__*/React.createElement(Button, null, "Middle Right"));
export const topLeft = () => /*#__PURE__*/React.createElement(RadarAnimation, {
  position: RadarAnimationPosition.TOP_LEFT
}, /*#__PURE__*/React.createElement(Button, null, "Top Left"));
export const topCenter = () => /*#__PURE__*/React.createElement(RadarAnimation, {
  position: RadarAnimationPosition.TOP_CENTER
}, /*#__PURE__*/React.createElement(Button, null, "Top Center"));
export const topRight = () => /*#__PURE__*/React.createElement(RadarAnimation, {
  position: RadarAnimationPosition.TOP_RIGHT
}, /*#__PURE__*/React.createElement(Button, null, "Top Right"));
export const withOffset = () => /*#__PURE__*/React.createElement("div", {
  style: {
    marginLeft: 5
  }
}, /*#__PURE__*/React.createElement(RadarAnimation, {
  position: RadarAnimationPosition.MIDDLE_LEFT,
  offset: "0 20px"
}, /*#__PURE__*/React.createElement(Button, null, "Middle Left, with offset")));
export default {
  title: 'Components/RadarAnimation',
  component: RadarAnimation,
  parameters: {
    notes
  }
};
//# sourceMappingURL=RadarAnimation.stories.js.map