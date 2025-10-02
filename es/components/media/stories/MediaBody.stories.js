import * as React from 'react';
import Avatar from '../../avatar/Avatar';
import MenuItem from '../../menu/MenuItem';
import Media from '../Media';
import MediaBody from '../MediaBody';
import notes from './MediaBody.stories.md';
import { bdlWatermelonRed } from '../../../styles/variables';
export const example = () => /*#__PURE__*/React.createElement(Media, {
  style: {
    width: 300
  }
}, /*#__PURE__*/React.createElement(Media.Figure, null, /*#__PURE__*/React.createElement(Avatar, {
  size: "large"
})), /*#__PURE__*/React.createElement(Media.Body, {
  style: {
    boxShadow: `0 0 2px 3px ${bdlWatermelonRed}`
  }
}, /*#__PURE__*/React.createElement(Media.Menu, null, /*#__PURE__*/React.createElement(MenuItem, null, "Edit"), /*#__PURE__*/React.createElement(MenuItem, null, "Delete")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Yo Yo Ma"), " commented on this file"), /*#__PURE__*/React.createElement("div", null, "Long strings without spaces wrap:", /*#__PURE__*/React.createElement("br", null), "Thistextdoesnothaveanyspacesanditshouldbewrappedinsidethecontaineralignedwiththerightedge", /*#__PURE__*/React.createElement("br", null), "a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9")));
export default {
  title: 'Components/Media/MediaBody',
  component: MediaBody,
  parameters: {
    notes
  }
};
//# sourceMappingURL=MediaBody.stories.js.map