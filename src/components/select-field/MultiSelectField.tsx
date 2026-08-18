import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import type { SelectOptionProp } from './props';
import { BaseSelectFieldBase } from './BaseSelectField';
import type { BaseSelectFieldProps } from './BaseSelectField';
import CLEAR from './constants';
import messages from './messages';

export interface MultiSelectFieldProps
    extends Partial<Omit<BaseSelectFieldProps, 'intl' | 'multiple' | 'onChange' | 'options'>> {
    /** Intl object provided by injectIntl */
    intl: IntlShape;
    /** Function will be called with an array of all selected options after user selects a new option */
    onChange: (selectedOptions: Array<SelectOptionProp>) => void;
    /** List of options (displayText, value) */
    options: Array<SelectOptionProp>;
    /** Boolean to determine whether or not to show the clear option */
    shouldShowClearOption?: boolean;
    /** Whether to show the search field */
    shouldShowSearchInput?: boolean;
}

const optionsWithClearOption = (
    options: Array<SelectOptionProp>,
    shouldShowClearOption: boolean | undefined,
    intl: IntlShape,
) => {
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

const MultiSelectField = ({ intl, options, shouldShowClearOption, ...rest }: MultiSelectFieldProps) => (
    <BaseSelectFieldBase
        {...rest}
        intl={intl}
        shouldShowClearOption={shouldShowClearOption}
        options={optionsWithClearOption(options, shouldShowClearOption, intl)}
        multiple
    />
);

export { MultiSelectField as MultiSelectFieldBase };
export default injectIntl(MultiSelectField);
