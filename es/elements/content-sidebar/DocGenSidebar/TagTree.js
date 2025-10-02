import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import { Accordion } from '@box/blueprint-web';
import './DocGenSidebar.scss';
const TagTree = ({
  data,
  level = 0
}) => {
  if (!data) {
    return null;
  }
  return /*#__PURE__*/React.createElement(Accordion, {
    type: "multiple",
    className: "bcs-DocGen-accordion"
  }, Object.keys(data).sort().map(key => {
    if (isEmpty(data[key])) {
      return /*#__PURE__*/React.createElement(Accordion.Item, {
        value: key,
        key: `${key}-${level}`,
        style: {
          paddingLeft: `${level * 12}px`
        },
        fixed: true,
        className: "bcs-DocGen-collapsible"
      }, /*#__PURE__*/React.createElement("span", {
        className: "bcs-DocGen-tagPath"
      }, key));
    }
    return /*#__PURE__*/React.createElement(Accordion.Item, {
      value: key,
      title: key,
      key: `${key}-${level}`,
      style: {
        paddingLeft: `${level * 12}px`
      },
      className: "bcs-DocGen-collapsible"
    }, data[key] && /*#__PURE__*/React.createElement(TagTree, {
      data: data[key],
      level: level + 1
    }));
  }));
};
export default TagTree;
//# sourceMappingURL=TagTree.js.map