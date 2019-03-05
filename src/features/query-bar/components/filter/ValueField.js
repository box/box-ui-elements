// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import DatePicker from '../../../../components/date-picker';
import SingleSelectField from '../../../../components/select-field/SingleSelectField';
import MultiSelectField from '../../../../components/select-field/MultiSelectField';
import TextInput from '../../../../components/text-input';
import { VALUE } from '../../constants';
import messages from '../../messages';

import '../../styles/Condition.scss';

type Props = {
    onChange: (value: Array<string>) => void,
    selectedValues: Array<string>,
    valueOptions: Array<Object>,
    valueType: string,
};

const ValueField = ({ onChange, selectedValues, valueOptions, valueType }: Props) => {
    const isValueSet = selectedValues.length > 0;
    const value = isValueSet ? selectedValues[0] : null;
    const onInputChange = e => {
        return e.target.value !== '' ? onChange([e.target.value]) : onChange([]);
    };

    switch (valueType) {
        case 'string':
            return (
                <div className="filter-dropdown-text-field-container">
                    <TextInput
                        hideLabel
                        label="String input"
                        name="string field"
                        onChange={onInputChange}
                        placeholder="Enter a string"
                        value={value}
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
                        onChange={onInputChange}
                        placeholder="Enter a number"
                        value={value}
                    />
                </div>
            );
        case 'float':
            return (
                <div className="filter-dropdown-text-field-container">
                    <TextInput
                        hideLabel
                        label="Float input"
                        name="float field"
                        onChange={onInputChange}
                        placeholder="Enter a float"
                        value={value}
                    />
                </div>
            );
        case 'date':
            return (
                <div className="filter-dropdown-date-field-container">
                    <DatePicker
                        displayFormat={{
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        }}
                        hideLabel
                        label="Date"
                        name="datepicker"
                        onChange={e => {
                            return e ? onChange([e.toString()]) : onChange([]);
                        }}
                        placeholder="Date"
                        value={isValueSet && selectedValues[0] !== '' ? new Date(selectedValues[0]) : undefined}
                    />
                </div>
            );
        case 'enum':
            return (
                <SingleSelectField
                    fieldType={VALUE}
                    onChange={e => onChange([e.value])}
                    options={valueOptions}
                    placeholder={<FormattedMessage {...messages.selectValuePlaceholderText} />}
                    selectedValue={value}
                />
            );
        case 'multi-enum':
            return (
                <MultiSelectField
                    fieldType={VALUE}
                    onChange={e => onChange(e.map(option => option.value))}
                    options={valueOptions}
                    placeholder={<FormattedMessage {...messages.selectValuePlaceholderText} />}
                    selectedValues={selectedValues}
                />
            );
        default:
            return null;
    }
};

export default ValueField;
