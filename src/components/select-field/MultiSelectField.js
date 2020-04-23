// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';

import type { SelectOptionProp } from './props';
import BaseSelectField from './BaseSelectField';
import messages from './messages';

type Props = {
    /* Intl object */
    intl: Object,
    /** Function will be called with an array of all selected options after user selects a new option */
    onChange: Function,
    /** List of options (displayText, value) */
    options: Array<SelectOptionProp>,
    /** Boolean to determine whether or not to show the clear option */
    shouldShowClearOption?: boolean,
};

const optionsWithClearOption = (options: Array<Object>, shouldShowClearOption?: boolean, intl: Object) => {
    if (shouldShowClearOption) {
        const updatedOptions = cloneDeep(options);
        updatedOptions.unshift({
            value: 'clear',
            displayText: intl.formatMessage(messages.clearAll),
        });
        return updatedOptions;
    }
    return options;
};

const MultiSelectField = ({ intl, ...rest }: Props) => (
    <BaseSelectField
        {...rest}
        options={optionsWithClearOption(rest.options, rest.shouldShowClearOption, intl)}
        multiple
    />
);

export { MultiSelectField as MultiSelectFieldBase };
export default injectIntl(MultiSelectField);
