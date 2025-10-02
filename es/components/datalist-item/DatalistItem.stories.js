import * as React from 'react';

// @ts-ignore JS Import
import DatalistItem from './DatalistItem';
import notes from './DatalistItem.stories.md';
export const Example = () => {
  return /*#__PURE__*/React.createElement(DatalistItem, {
    isSelected: true
  }, "Text");
};
export default {
  title: 'Components/Dropdowns/ListItems/DatalistItem',
  component: DatalistItem,
  parameters: {
    notes
  }
};
//# sourceMappingURL=DatalistItem.stories.js.map