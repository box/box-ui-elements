import isEqual from 'lodash/isEqual';
// Filter out anything that has already been selected to prevent duplicates
function getDuplicatesFilter(selectedValues) {
  const values = Array.isArray(selectedValues) ? selectedValues : [];
  return option => !values.find(value => isEqual(value, option));
}

// Filter out anything that does not match the display text of the options
function getTextFilter(inputText) {
  const text = inputText || '';
  return option => option.displayText.toLowerCase().includes(text.toLowerCase());
}
function defaultDropdownFilter(options, selectedValues, inputText) {
  return options.filter(getDuplicatesFilter(selectedValues)).filter(getTextFilter(inputText));
}
export default defaultDropdownFilter;
//# sourceMappingURL=defaultDropdownFilter.js.map