import * as React from 'react';
import omit from 'lodash/omit';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import { BaseSelectFieldBase } from './BaseSelectField';
import type { BaseSelectFieldProps } from './BaseSelectField';
import type { SelectOptionValueProp, SelectOptionProp } from './props';
import CLEAR from './constants';
import messages from './messages';

export interface SingleSelectFieldProps
    extends Partial<
        Omit<BaseSelectFieldProps, 'intl' | 'multiple' | 'onChange' | 'options' | 'placeholder' | 'selectedValues'>
    > {
    /** Multi-select specific prop that is stripped before forwarding to BaseSelectField */
    defaultValue?: SelectOptionValueProp;
    /** The type of the field */
    fieldType?: string;
    /** Intl object provided by injectIntl */
    intl: IntlShape;
    /** The select field is disabled if true */
    isDisabled?: boolean;
    /** The select field overlay (dropdown) will have a scrollbar and max-height if true */
    isScrollable?: boolean;
    /** Multi-select specific prop that is stripped before forwarding to BaseSelectField */
    multiple?: boolean;
    /** Function will be called with the selected option after user selects a new option */
    onChange: (option: SelectOptionProp | { value: null }, fieldType?: string) => void;
    /** List of options (displayText, value) */
    options: Array<SelectOptionProp>;
    /** The placeholder text for the field */
    placeholder?: string | React.ReactNode;
    /** The currently selected option value */
    selectedValue?: SelectOptionValueProp;
    /** Whether to show the Clear All option */
    shouldShowClearOption?: boolean;
}

class SingleSelectField extends React.Component<SingleSelectFieldProps> {
    handleChange = (selectedOptions: Array<SelectOptionProp>) => {
        const { onChange, fieldType } = this.props;

        // There should only ever be 1 selected item
        if (onChange && selectedOptions.length === 1) {
            onChange(selectedOptions[0], fieldType);
        } else if (selectedOptions.length === 0) {
            onChange({ value: null });
        }
    };

    render() {
        const { intl, isDisabled, selectedValue, placeholder, shouldShowClearOption, options, ...rest } = this.props;

        // @TODO: Invariant testing
        // 1) selectedValue is required to be contained in the options
        // 2) # of options should be non-zero

        // Make sure to omit passed props that could be interpreted incorrectly by the base component
        const selectFieldProps = omit(rest, ['defaultValue', 'multiple', 'onChange']) as Partial<BaseSelectFieldProps>;

        // If selectedValue is passed in, map it to the multi selected equivalent
        const isFieldSelected = selectedValue !== null;
        selectFieldProps.selectedValues = !isFieldSelected ? [] : [selectedValue];

        const optionsWithClearOption = shouldShowClearOption
            ? [
                  {
                      value: CLEAR,
                      displayText: intl.formatMessage(messages.clearAll),
                  },
                  ...options,
              ]
            : options;

        return (
            <BaseSelectFieldBase
                className={!isFieldSelected && placeholder ? 'placeholder' : ''}
                isDisabled={isDisabled}
                intl={intl}
                onChange={this.handleChange}
                placeholder={placeholder}
                options={optionsWithClearOption}
                shouldShowClearOption={shouldShowClearOption}
                {...selectFieldProps}
            />
        );
    }
}

export { SingleSelectField as SingleSelectFieldBase };
export default injectIntl(SingleSelectField);
