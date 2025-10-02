function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import PlainButton from '../plain-button/PlainButton';
// @ts-ignore flow import
import DropdownMenu, { MenuToggle } from '../dropdown-menu';
import { Menu, SelectMenuItem } from '../menu';
import messages from './messages';
import './CategorySelector.scss';
const CategorySelectorComponent = ({
  measureRef,
  moreRef,
  className,
  categories,
  maxLinks,
  currentCategory,
  categoryProps,
  onSelect
}) => {
  const linkCategories = categories.slice(0, maxLinks);
  const overflowCategories = categories.slice(maxLinks);
  const selectedOverflow = overflowCategories.find(({
    value
  }) => currentCategory === value);
  const renderCategory = ({
    value,
    displayText
  }) => /*#__PURE__*/React.createElement("span", _extends({
    key: value,
    className: classnames('bdl-CategorySelector-pill', {
      'is-selected': value === currentCategory
    }),
    "data-category": value,
    "data-resin-target": "selectcategory",
    "data-resin-template_category": displayText,
    "data-testid": `template-category-${value}`,
    onClick: () => onSelect(value),
    onKeyPress: event => {
      if (event.key === 'Enter' || event.key === ' ') onSelect(value);
    },
    role: "button",
    tabIndex: 0
  }, categoryProps), displayText);
  return /*#__PURE__*/React.createElement("div", {
    ref: measureRef,
    className: classnames(className, 'bdl-CategorySelector')
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdl-CategorySelector-links"
  }, linkCategories.map(renderCategory)), /*#__PURE__*/React.createElement("div", {
    ref: moreRef,
    className: classnames('bdl-CategorySelector-more', {
      hide: maxLinks >= categories.length
    })
  }, /*#__PURE__*/React.createElement(DropdownMenu, {
    className: "dropdownWrapper",
    isRightAligned: true
  }, /*#__PURE__*/React.createElement(PlainButton, {
    className: classnames('bdl-CategorySelector-more-label', {
      'is-selected': selectedOverflow
    })
  }, /*#__PURE__*/React.createElement(MenuToggle, null, selectedOverflow ? selectedOverflow.displayText : /*#__PURE__*/React.createElement(FormattedMessage, messages.more))), /*#__PURE__*/React.createElement(Menu, null, overflowCategories.map(({
    value,
    displayText
  }) => /*#__PURE__*/React.createElement(SelectMenuItem, {
    key: value,
    "data-testid": `template-category-more-${value}`,
    isSelected: value === currentCategory,
    onClick: () => onSelect(value)
  }, displayText))))));
};
export default CategorySelectorComponent;
//# sourceMappingURL=CategorySelectorComponent.js.map