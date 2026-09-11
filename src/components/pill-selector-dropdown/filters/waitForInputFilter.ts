import defaultDropdownFilter from './defaultDropdownFilter';

import type { Option } from '../types';

// Same as default filter except that it won't show the selector dropdown until the user begins typing
// (as opposed to showing it when the input is focused)
function waitForInputFilter(
    options: Array<Option>,
    selectedValues?: Array<Option> | null,
    inputText?: string,
): Array<Option> {
    return inputText && inputText.length ? defaultDropdownFilter(options, selectedValues, inputText) : [];
}

export default waitForInputFilter;
