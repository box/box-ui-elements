import uniqBy from 'lodash/uniqBy';
import escapeRegExp from 'lodash/escapeRegExp';

import parseCSV from '../../utils/parseCSV';

import type { Option } from './types';

// Maps comma-separated input to options using case-insensitive displayText or value matches.
// Unmatched tokens become custom options; duplicates and selected options are excluded.
function defaultInputParser(inputValue: string, options: Array<Option>, selectedOptions: Array<Option>): Array<Option> {
    let mappedOptions;
    const inputTokens = parseCSV(inputValue);

    mappedOptions = inputTokens.map((inputToken: string): Option => {
        const trimmedInputToken = inputToken.replace(/\s/g, '');
        const escapedInputToken = escapeRegExp(trimmedInputToken);
        const regex = new RegExp(`^${escapedInputToken}$`, 'i');

        const existingOption = options.find(
            ({ displayText, value }: Option) =>
                // Match name without whitespace or commas
                regex.test(displayText!.replace(/\s|,/g, '')) || regex.test(String(value)),
        );
        const mappedOption = existingOption || {
            displayText: inputToken,
            value: inputToken,
        };
        return mappedOption;
    });
    // Remove duplicate values
    mappedOptions = uniqBy(mappedOptions, (mappedOption: Option) => mappedOption.value);
    // Remove previously selected values
    mappedOptions = mappedOptions.filter(
        mappedOption => !selectedOptions.some(selectedOption => mappedOption.value === selectedOption.value),
    );
    return mappedOptions;
}

export default defaultInputParser;
