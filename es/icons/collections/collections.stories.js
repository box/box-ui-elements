import * as React from 'react';
import IconCollections from './IconCollections';
import IconCollectionsAdd from './IconCollectionsAdd';
import IconCollectionsBolt from './IconCollectionsBolt';
import IconCollectionsFilled from './IconCollectionsFilled';
import IconCollectionsStar from './IconCollectionsStar';
import IconCollectionsStarFilled from './IconCollectionsStarFilled';
const section = {
  display: 'flex'
};
const icon = {
  display: 'flex',
  'flex-direction': 'column',
  'align-items': 'center',
  'margin-right': '20px'
};
const Icon = ({
  children,
  name
}) => {
  return /*#__PURE__*/React.createElement("div", {
    style: icon
  }, children, /*#__PURE__*/React.createElement("span", null, name));
};
export const allIcons = () => /*#__PURE__*/React.createElement("div", {
  style: section
}, /*#__PURE__*/React.createElement(Icon, {
  name: "Collections"
}, /*#__PURE__*/React.createElement(IconCollections, null)), /*#__PURE__*/React.createElement(Icon, {
  name: "Collections Add"
}, /*#__PURE__*/React.createElement(IconCollectionsAdd, null)), /*#__PURE__*/React.createElement(Icon, {
  name: "Collections Bolt"
}, /*#__PURE__*/React.createElement(IconCollectionsBolt, null)), /*#__PURE__*/React.createElement(Icon, {
  name: "Collections Filled"
}, /*#__PURE__*/React.createElement(IconCollectionsFilled, null)), /*#__PURE__*/React.createElement(Icon, {
  name: "Collections Star"
}, /*#__PURE__*/React.createElement(IconCollectionsStar, null)), /*#__PURE__*/React.createElement(Icon, {
  name: "Collections Star Filled"
}, /*#__PURE__*/React.createElement(IconCollectionsStarFilled, null)));
export default {
  title: 'Icons/Collections'
};
//# sourceMappingURL=collections.stories.js.map