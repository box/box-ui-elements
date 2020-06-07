// @flow
import * as React from 'react';
import omit from 'lodash/omit';
import { injectIntl } from 'react-intl';

import BaseSelectField from './BaseSelectField';
import type { SelectOptionValueProp, SelectOptionProp } from './props';
import CLEAR from './constants';
import messages from './messages';

type Props = {
    /** The type of the field */
    fieldType?: string,
    /* Intl object */
    intl: Object,
    /** The select field is disabled if true */
    isDisabled?: boolean,
    /** The select field overlay (dropdown) will have a scrollbar and max-height if true * */
    isScrollable?: boolean,
    /** The currently selected option value */
    onChange: Function,
    /** List of options (displayText, value) */
    options: Array<SelectOptionProp>,
    /** The placeholder text for the field  */
    placeholder?: string | React.Node,
    /** Function will be called with the selected option after user selects a new option */
    selectedValue?: SelectOptionValueProp,
    /** Will show Clear All option */
    shouldShowClearOption?: boolean,
};

class SingleSelectField extends React.Component<Props> {
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
        const selectFieldProps = omit(rest, ['defaultValue', 'multiple', 'onChange']);

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
            <BaseSelectField
                className={!isFieldSelected && placeholder ? 'placeholder' : ''}
                isDisabled={isDisabled}
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
