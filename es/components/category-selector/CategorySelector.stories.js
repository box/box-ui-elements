import * as React from 'react';
import CategorySelector from './CategorySelector';
import notes from './CategorySelector.stories.md';
const categories = [{
  value: 'all',
  displayText: 'All'
}, {
  value: 'legal',
  displayText: 'Legal'
}, {
  value: 'marketing',
  displayText: 'Marketing'
}, {
  value: 'hr',
  displayText: 'HR'
}, {
  value: 'bizops',
  displayText: 'Business Operations'
}, {
  value: 'sales',
  displayText: 'Sales'
}, {
  value: 'finance',
  displayText: 'Finance'
}];
const CategorySelectorContainer = () => {
  const [category, setCategory] = React.useState('all');
  return /*#__PURE__*/React.createElement(CategorySelector, {
    categories: categories,
    currentCategory: category,
    onSelect: value => {
      setCategory(value);
    }
  });
};
export const basic = () => /*#__PURE__*/React.createElement(CategorySelectorContainer, null);
export const withDropdown = () => {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 400
    }
  }, /*#__PURE__*/React.createElement(CategorySelectorContainer, null));
};
export default {
  title: 'Components/CategorySelector',
  component: CategorySelector,
  parameters: {
    notes
  }
};
//# sourceMappingURL=CategorySelector.stories.js.map