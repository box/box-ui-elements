import * as React from 'react';
import ItemIcon from './item-icon';
import Tooltip, { TooltipPosition } from '../components/tooltip';
const itemTypeOptions = ['default', 'audio', 'bookmark', 'boxnote', 'code', 'document', 'dwg', 'excel-spreadsheet', 'google-docs', 'google-sheets', 'google-slides', 'illustrator', 'image', 'indesign', 'keynote', 'numbers', 'pages', 'pdf', 'photoshop', 'powerpoint-presentation', 'presentation', 'spreadsheet', 'text', 'threed', 'vector', 'video', 'word-document', 'zip', 'folder-collab', 'folder-external', 'folder-plain'];
export const itemIcons = () => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, itemTypeOptions.map(t => /*#__PURE__*/React.createElement("span", {
    style: {
      padding: 8
    },
    key: t
  }, /*#__PURE__*/React.createElement(Tooltip, {
    text: t
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement(ItemIcon, {
    dimension: 32,
    iconType: t
  }))))), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Hover icons in grid to view the ", /*#__PURE__*/React.createElement("code", null, "iconType"), " prop"), /*#__PURE__*/React.createElement("p", {
    style: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: 16,
      paddingLeft: 8
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    text: "default",
    isShown: true,
    position: TooltipPosition.MIDDLE_RIGHT
  }, /*#__PURE__*/React.createElement(ItemIcon, {
    iconType: "default",
    dimension: 32
  })))));
};
const description = `
  ItemIcon, and the solid-color variant ItemIconMonotone, are catch-all components that render the appropriate
  icon for a given file or folder type
`;
export default {
  title: 'Icons/ItemIcon',
  component: ItemIcon,
  parameters: {
    componentSubtitle: description
  }
};
//# sourceMappingURL=icons.stories.js.map