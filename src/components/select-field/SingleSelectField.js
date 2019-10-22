// @flow
import * as React from 'react';
import omit from 'lodash/omit';

import BaseSelectField from './BaseSelectField';
import type { SelectOptionValueProp, SelectOptionProp } from './props';

type Props = {
    /** The type of the field */
    fieldType?: string,
    /** The select field is disabled if true */
    isDisabled?: boolean,
    /** The select field overlay (dropdown) will have a scrollbar and max-height if true * */
    isScrollable?: boolean,
    /** The currently selected option value */
    onChange: Function,
    /** The placeholder text for the field  */
    placeholder?: string | React.Node,
    /** Function will be called with the selected option after user selects a new option */
    selectedValue?: SelectOptionValueProp,
};

class SingleSelectField extends React.Component<Props> {
    handleChange = (selectedOptions: Array<SelectOptionProp>) => {
        const { onChange, fieldType } = this.props;

        // There should only ever be 1 selected item
        if (onChange && selectedOptions.length === 1) {
            onChange(selectedOptions[0], fieldType);
        }
    };

    render() {
        const { isDisabled, selectedValue, placeholder, ...rest } = this.props;

        // @TODO: Invariant testing
        // 1) selectedValue is required to be contained in the options
        // 2) # of options should be non-zero

        // Make sure to omit passed props that could be interpreted incorrectly by the base component
        const selectFieldProps = omit(rest, ['defaultValue', 'multiple', 'onChange']);

        // If selectedValue is passed in, map it to the multi selected equivalent
        const isFieldSelected = selectedValue !== null;
        selectFieldProps.selectedValues = !isFieldSelected ? [] : [selectedValue];

        return (
            <BaseSelectField
                className={!isFieldSelected && placeholder ? 'placeholder' : ''}
                isDisabled={isDisabled}
                onChange={this.handleChange}
                placeholder={placeholder}
                {...selectFieldProps}
            />
        );
    }
}

export default SingleSelectField;
