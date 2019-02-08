// @flow
import * as React from 'react';

import SingleSelectField from '../../../components/select-field/SingleSelectField';
import TextInput from '../../../components/text-input';
import DatePicker from '../../../components/date-picker';

import messages from '../messages';
import { VALUE } from '../constants';

import '../styles/FilterItem.scss';

type Props = {
    formatMessage: Function,
    selectedValue?: string | number,
    shouldDisplayErrorMessage: boolean,
    updateSelectedField: Function,
    updateValueField: Function,
    valueKey?: string | Date | number,
    valueOptions: Array<Object>,
    valueType: string,
};

const FilterValueField = ({
    formatMessage,
    selectedValue,
    shouldDisplayErrorMessage,
    updateValueField,
    updateSelectedField,
    valueKey,
    valueOptions,
    valueType,
}: Props) => {
    switch (valueType) {
        case 'string':
            return (
                <div className="filter-dropdown-text-field-container">
                    <TextInput
                        hideLabel
                        label="String input"
                        name="string field"
                        onChange={updateValueField}
                        placeholder="Enter a string"
                        value={selectedValue || ''}
                    />
                </div>
            );
        case 'number':
            return (
                <div className="filter-dropdown-text-field-container">
                    <TextInput
                        hideLabel
                        label="Number input"
                        name="number field"
                        onChange={updateValueField}
                        placeholder="Enter a number"
                        value={selectedValue || ''}
                    />
                </div>
            );
        case 'float':
            return (
                <div className="filter-dropdown-text-field-container">
                    <TextInput
                        hideLabel
                        error={shouldDisplayErrorMessage ? 'Please enter a number' : null}
                        label="Float input"
                        name="float field"
                        onChange={updateValueField}
                        placeholder="Enter a float"
                        value={selectedValue || ''}
                    />
                </div>
            );
        case 'date':
            return (
                <div className="filter-dropdown-date-field-container">
                    <DatePicker
                        className="date-picker-example"
                        displayFormat={{
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        }}
                        hideLabel
                        label="Date"
                        name="datepicker"
                        onChange={updateValueField}
                        placeholder="Date"
                        value={valueKey ? new Date(valueKey) : undefined}
                    />
                </div>
            );
        case 'enum':
            return (
                <SingleSelectField
                    fieldType={VALUE}
                    onChange={updateSelectedField}
                    options={valueOptions}
                    placeholder={formatMessage(messages.selectValuePlaceholderText)}
                    selectedValue={selectedValue}
                />
            );
        default:
            return (
                <div className="filter-dropdown-text-field-container">
                    <TextInput
                        hideLabel
                        disabled
                        label="Text Input"
                        name="Text field"
                        onChange={updateValueField}
                        placeholder="Enter value"
                        value={selectedValue || ''}
                    />
                </div>
            );
    }
};

export default FilterValueField;
