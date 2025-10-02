import * as React from 'react';
import noop from 'lodash/noop';
import SuggestedPill from './SuggestedPill';
import './SuggestedPillsRow.scss';
const SuggestedPillsRow = ({
  onSuggestedPillAdd = noop,
  selectedPillsValues = [],
  suggestedPillsData = [],
  suggestedPillsFilter = 'id',
  title
}) => {
  // Prevents pills from being rendered that are in the form by checking for value (id or custom value)
  const filteredSuggestedPillData = suggestedPillsData.filter(item => !selectedPillsValues.includes(item[suggestedPillsFilter]));
  if (filteredSuggestedPillData.length === 0) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pill-selector-suggested"
  }, /*#__PURE__*/React.createElement("span", null, title), filteredSuggestedPillData.map(item => /*#__PURE__*/React.createElement(SuggestedPill, {
    key: item.id,
    email: item.email,
    id: item.id,
    name: item.name,
    onAdd: onSuggestedPillAdd
  })));
};
export default SuggestedPillsRow;
//# sourceMappingURL=SuggestedPillsRow.js.map