import defaultDropdownFilter from './defaultDropdownFilter';
// Same as default filter except that it won't show the selector dropdown until the user begins typing
// (as opposed to showing it when the input is focused)
function waitForInputFilter(options, selectedValues, inputText) {
  if (inputText && inputText.length) {
    return defaultDropdownFilter(options, selectedValues, inputText);
  }
  return [];
}
export default waitForInputFilter;
//# sourceMappingURL=waitForInputFilter.js.map