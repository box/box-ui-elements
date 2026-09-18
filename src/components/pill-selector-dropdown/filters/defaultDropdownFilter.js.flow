// @flow
import isEqual from 'lodash/isEqual';
import type { Option } from '../flowTypes';

type Filter = (option: Option) => boolean;

// Filter out anything that has already been selected to prevent duplicates
function getDuplicatesFilter(selectedValues?: Array<Option>): Filter {
    const values = Array.isArray(selectedValues) ? selectedValues : [];
    return (option: Option) => !values.find(value => isEqual(value, option));
}

// Filter out anything that does not match the display text of the options
function getTextFilter(inputText?: string): Filter {
    const text = inputText || '';
    return (option: Option) => option.displayText.toLowerCase().includes(text.toLowerCase());
}

function defaultDropdownFilter(
    options: Array<Option>,
    selectedValues?: Array<Option>,
    inputText?: string,
): Array<Option> {
    return options.filter(getDuplicatesFilter(selectedValues)).filter(getTextFilter(inputText));
}

export default defaultDropdownFilter;
