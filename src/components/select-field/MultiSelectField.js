// @flow
import React from 'react';
import { injectIntl } from 'react-intl';

import type { SelectOptionProp } from './props';
import BaseSelectField from './BaseSelectField';
import CLEAR from './constants';
import messages from './messages';

type Props = {
    /* Intl object */
    intl: Object,
    /** Function will be called with an array of all selected options after user selects a new option */
    onChange: Function,
    /** List of options (displayText, value) */
    options: Array<SelectOptionProp>,
    /** Boolean to determine whether the dropdown should be in fixed position */
    positionFixed?: boolean,
    /** Boolean to determine whether or not to show the clear option */
    shouldShowClearOption?: boolean,
    /** Will show Search Field  */
    shouldShowSearchInput?: boolean,
};

const optionsWithClearOption = (options: Array<Object>, shouldShowClearOption?: boolean, intl: Object) => {
    return shouldShowClearOption
        ? [
              {
                  value: CLEAR,
                  displayText: intl.formatMessage(messages.clearAll),
              },
              ...options,
          ]
        : options;
};

const MultiSelectField = ({ intl, options, positionFixed, shouldShowClearOption, ...rest }: Props) => (
    <BaseSelectField
        {...rest}
        shouldShowClearOption={shouldShowClearOption}
        options={optionsWithClearOption(options, shouldShowClearOption, intl)}
        multiple
        positionFixed={positionFixed}
    />
);

export { MultiSelectField as MultiSelectFieldBase };
export default injectIntl(MultiSelectField);
