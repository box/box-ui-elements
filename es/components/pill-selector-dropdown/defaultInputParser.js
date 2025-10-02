import uniqBy from 'lodash/uniqBy';
import escapeRegExp from 'lodash/escapeRegExp';
import parseCSV from '../../utils/parseCSV';
// Custom input parser for the PillSelectorDropdownField that automatically maps
// a list of comma separated values to their respective Option objects. The parser
// will try to find exact but case-insenstive matches using the option's displayText
// property. If a token does not match displayText, the parser will also try to match
// the string representation of the value property. This last match is useful for country
// codes and other similar use cases.
function defaultInputParser(inputValue, options, selectedOptions) {
  let mappedOptions;
  const inputTokens = parseCSV(inputValue);
  mappedOptions = inputTokens.map(inputToken => {
    const trimmedInputToken = inputToken.replace(/\s/g, '');
    const escapedInputToken = escapeRegExp(trimmedInputToken);
    const regex = new RegExp(`^${escapedInputToken}$`, 'i');
    const existingOption = options.find(({
      displayText,
      value
    }) =>
    // Match name without whitespace or commas
    regex.test(displayText.replace(/\s|,/g, '')) || regex.test(String(value)));
    const mappedOption = existingOption || {
      displayText: inputToken,
      value: inputToken
    };
    return mappedOption;
  });
  // Remove duplicate values
  mappedOptions = uniqBy(mappedOptions, mappedOption => mappedOption.value);
  // Remove previously selected values
  mappedOptions = mappedOptions.filter(mappedOption => !selectedOptions.some(selectedOption => mappedOption.value === selectedOption.value));
  return mappedOptions;
}
export default defaultInputParser;
//# sourceMappingURL=defaultInputParser.js.map