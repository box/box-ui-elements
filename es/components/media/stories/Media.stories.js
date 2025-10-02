import * as React from 'react';
import Avatar from '../../avatar/Avatar';
import Button from '../../button/Button';
import MenuItem from '../../menu/MenuItem';
// @ts-ignore TODO: migrate TextArea to typescript
import TextArea from '../../text-area';
import Media from '../Media';
import notes from './Media.stories.md';
import { bdlGreenLight, bdlPurpleRain, bdlWatermelonRed, bdlYellorange } from '../../../styles/variables';
export const example = () => /*#__PURE__*/React.createElement(Media, {
  style: {
    width: 300
  }
}, /*#__PURE__*/React.createElement(Media.Figure, null, /*#__PURE__*/React.createElement(Avatar, {
  size: "large"
})), /*#__PURE__*/React.createElement(Media.Body, null, /*#__PURE__*/React.createElement(Media.Menu, {
  "aria-label": "Options"
}, /*#__PURE__*/React.createElement(MenuItem, null, "Edit"), /*#__PURE__*/React.createElement(MenuItem, null, "Delete")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Yo Yo Ma"), " commented on this file"), /*#__PURE__*/React.createElement("div", null, "Please review the notes", /*#__PURE__*/React.createElement("br", null), "a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9")));
export const exampleExplanation = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, /*#__PURE__*/React.createElement("span", {
  style: {
    color: bdlGreenLight
  }
}, "Media"), /*#__PURE__*/React.createElement("span", {
  style: {
    color: bdlPurpleRain
  }
}, "Media.Figure"), /*#__PURE__*/React.createElement("span", {
  style: {
    color: bdlYellorange
  }
}, "Media.Body"), /*#__PURE__*/React.createElement("span", {
  style: {
    color: bdlWatermelonRed
  }
}, "Media.Menu")), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Media, {
  style: {
    width: 300,
    boxShadow: `0 0 2px 3px ${bdlGreenLight}`,
    padding: 5
  }
}, /*#__PURE__*/React.createElement(Media.Figure, {
  style: {
    boxShadow: `0 0 2px 3px ${bdlPurpleRain}`
  }
}, /*#__PURE__*/React.createElement(Avatar, {
  size: "large"
})), /*#__PURE__*/React.createElement(Media.Body, {
  style: {
    boxShadow: `0 0 2px 3px ${bdlYellorange}`,
    padding: 3
  }
}, /*#__PURE__*/React.createElement(Media.Menu, {
  style: {
    boxShadow: `0 0 2px 3px ${bdlWatermelonRed}`,
    margin: 3,
    padding: 3
  }
}, /*#__PURE__*/React.createElement(MenuItem, null, "Edit"), /*#__PURE__*/React.createElement(MenuItem, null, "Delete")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Yo Yo Ma"), " commented on this file"), /*#__PURE__*/React.createElement("div", null, "Please review the notes", /*#__PURE__*/React.createElement("br", null), "a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9"))));
export const withNestedComponents = () => /*#__PURE__*/React.createElement(Media, {
  style: {
    width: 300
  }
}, /*#__PURE__*/React.createElement(Media.Figure, null, /*#__PURE__*/React.createElement(Avatar, null)), /*#__PURE__*/React.createElement(Media.Body, null, /*#__PURE__*/React.createElement(Media.Menu, null, /*#__PURE__*/React.createElement(MenuItem, null, "Edit"), /*#__PURE__*/React.createElement(MenuItem, null, "Delete")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Yo Yo Ma"), " commented on this file"), /*#__PURE__*/React.createElement("div", null, "This is a nested media object"), /*#__PURE__*/React.createElement("ul", {
  style: {
    margin: 0,
    padding: 0
  }
}, /*#__PURE__*/React.createElement(Media, {
  as: "li",
  style: {
    marginTop: 10
  }
}, /*#__PURE__*/React.createElement(Media.Figure, null, /*#__PURE__*/React.createElement(Avatar, null)), /*#__PURE__*/React.createElement(Media.Body, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Bjork"), " replied"), /*#__PURE__*/React.createElement("div", null, "I must agree!"), /*#__PURE__*/React.createElement(Media, {
  as: "li",
  style: {
    marginTop: 10
  }
}, /*#__PURE__*/React.createElement(Media.Figure, null, /*#__PURE__*/React.createElement(Avatar, null)), /*#__PURE__*/React.createElement(Media.Body, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Bono"), " replied"), /*#__PURE__*/React.createElement("div", null, "Me too!"))))))));
export const withFormElements = () => /*#__PURE__*/React.createElement(Media, {
  style: {
    width: 300
  }
}, /*#__PURE__*/React.createElement(Media.Figure, null, /*#__PURE__*/React.createElement(Avatar, {
  size: "large"
})), /*#__PURE__*/React.createElement(Media.Body, null, /*#__PURE__*/React.createElement(Media.Menu, null, /*#__PURE__*/React.createElement(MenuItem, null, "Edit"), /*#__PURE__*/React.createElement(MenuItem, null, "Delete")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "W.A. Mozart"), " commented on this file"), /*#__PURE__*/React.createElement("div", null, "Everyone get ready to perform the symphony tonight!"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, null, "Reply"), /*#__PURE__*/React.createElement(Button, null, "Cancel"), /*#__PURE__*/React.createElement(TextArea, {
  label: "Response"
}))));
export default {
  title: 'Components/Media/Media',
  component: Media,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Media.stories.js.map