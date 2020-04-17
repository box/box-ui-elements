// @flow
import React from 'react';

import BaseSelectField from './BaseSelectField';

type Props = {
    /** Function will be called with an array of all selected options after user selects a new option */
    onChange: Function,
};

const optionsWithClearOption = (options: Array<Object>, shouldShowClearOption: boolean) => {
    if (shouldShowClearOption) {
        const updatedOptions = options;
        updatedOptions.unshift({
            value: 'clear',
            displayText: 'Clear All',
        });
        return updatedOptions;
    }
    return options;
};

const MultiSelectField = ({ ...rest }: Props) => (
    <BaseSelectField options={optionsWithClearOption(rest.options, rest.shouldShowClearOption)} {...rest} multiple />
);

export default MultiSelectField;
