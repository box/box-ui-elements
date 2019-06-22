// @flow
import defaultDropdownFilter from './defaultDropdownFilter';

import type { Option } from '../flowTypes';

// Same as default filter except that it won't show the selector dropdown until the user begins typing
// (as opposed to showing it when the input is focused)
function waitForInputFilter(options: Array<Option>, selectedValues?: Array<Option>, inputText?: string): Array<Option> {
    if (inputText && inputText.length) {
        return defaultDropdownFilter(options, selectedValues, inputText);
    }
    return [];
}

export default waitForInputFilter;
