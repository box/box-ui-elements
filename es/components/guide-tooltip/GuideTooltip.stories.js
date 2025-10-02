import * as React from 'react';
import GuideTooltip from './GuideTooltip';
import Button from '../button/Button';
import FolderShared32 from '../../icon/content/FolderShared32';
import notes from './GuideTooltip.stories.md';
// @ts-ignore flow import
import testImageSrc from './test-image.png';
const addSpacing = component => /*#__PURE__*/React.createElement("div", {
  style: {
    textAlign: 'center'
  }
}, component);
export const allOptionsWithIcon = () => addSpacing(/*#__PURE__*/React.createElement(GuideTooltip, {
  title: "Lorem Ipsum",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  icon: /*#__PURE__*/React.createElement(FolderShared32, null),
  steps: [1, 3]
  /* eslint-disable no-console */,
  primaryButtonProps: {
    children: 'Next',
    onClick: () => console.log('next')
  },
  secondaryButtonProps: {
    children: 'Back',
    onClick: () => console.log('back')
  }
  /* eslint-enable no-console */
}, /*#__PURE__*/React.createElement(Button, null, "example")));
allOptionsWithIcon.story = {
  name: 'body, icon, steps, title, next button, previous button'
};
export const titleImageBody = () => addSpacing(/*#__PURE__*/React.createElement(GuideTooltip, {
  title: "Lorem Ipsum",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  image: /*#__PURE__*/React.createElement("img", {
    src: testImageSrc,
    alt: "Lorem ipsum dolor"
  })
}, /*#__PURE__*/React.createElement(Button, null, "example")));
titleImageBody.story = {
  name: 'title, image, body'
};
export const noButtons = () => addSpacing(/*#__PURE__*/React.createElement(GuideTooltip, {
  title: "Lorem Ipsum",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  icon: /*#__PURE__*/React.createElement(FolderShared32, null),
  steps: [1, 3]
}, /*#__PURE__*/React.createElement(Button, null, "example")));
noButtons.story = {
  name: 'body, icon, steps, title'
};
export const onlyTitleBody = () => addSpacing(/*#__PURE__*/React.createElement(GuideTooltip, {
  title: "Lorem Ipsum",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
}, /*#__PURE__*/React.createElement(Button, null, "example")));
onlyTitleBody.story = {
  name: 'only title and body'
};
export const onlyBody = () => addSpacing(/*#__PURE__*/React.createElement(GuideTooltip, {
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
}, /*#__PURE__*/React.createElement(Button, null, "example")));
onlyBody.story = {
  name: 'only body'
};
export default {
  title: 'Components/GuideTooltip',
  component: GuideTooltip,
  parameters: {
    notes
  }
};
//# sourceMappingURL=GuideTooltip.stories.js.map