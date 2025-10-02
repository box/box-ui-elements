import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TagTree from './TagTree';
import './DocGenSidebar.scss';
const TagsSection = ({
  data,
  message
}) => {
  if (Object.keys(data).length === 0) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-TagsSection",
    "data-testid": "bcs-TagsSection"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bcs-TagsSection-header"
  }, /*#__PURE__*/React.createElement(FormattedMessage, message)), /*#__PURE__*/React.createElement("div", {
    className: "bcs-TagsSection-accordion-wrapper"
  }, /*#__PURE__*/React.createElement(TagTree, {
    data: data
  })));
};
export default TagsSection;
//# sourceMappingURL=TagsSection.js.map