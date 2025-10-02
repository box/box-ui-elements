import * as React from 'react';
import DatalistItem from '../datalist-item';
function defaultDropdownRenderer(options) {
  return options.map(({
    displayText,
    value
  }) => /*#__PURE__*/React.createElement(DatalistItem, {
    key: value
  }, displayText));
}
export default defaultDropdownRenderer;
//# sourceMappingURL=defaultDropdownRenderer.js.map