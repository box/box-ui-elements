import * as React from 'react';
import Media from '../media';
import Ghost from './Ghost';
import notes from './Ghost.stories.md';
export const regular = () => /*#__PURE__*/React.createElement(Ghost, {
  isAnimated: true
});
export const withoutAnimation = () => /*#__PURE__*/React.createElement(Ghost, {
  isAnimated: false
});
export const circle = () => /*#__PURE__*/React.createElement(Ghost, {
  borderRadius: "50%",
  width: 32,
  height: 32
});
export const rectangle = () => /*#__PURE__*/React.createElement(Ghost, {
  width: 100,
  height: 32
});
export const pill = () => /*#__PURE__*/React.createElement(Ghost, {
  borderRadius: 12,
  width: 100,
  height: 24
});
export const complicatedLayout = () => /*#__PURE__*/React.createElement(Media, {
  style: {
    maxWidth: 400
  }
}, /*#__PURE__*/React.createElement(Media.Figure, null, /*#__PURE__*/React.createElement(Ghost, {
  borderRadius: "50%",
  height: 32,
  width: 32
})), /*#__PURE__*/React.createElement(Media.Body, null, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(Ghost, null), /*#__PURE__*/React.createElement(Ghost, null), /*#__PURE__*/React.createElement(Ghost, {
  width: "50%"
})), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(Ghost, {
  width: 100,
  height: 32
}), " ", /*#__PURE__*/React.createElement(Ghost, {
  width: 100,
  height: 32
}))));
export default {
  title: 'Components/Ghost',
  component: Ghost,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Ghost.stories.js.map