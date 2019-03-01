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
    selectedValue: Array<string>,
    valueOptions: Array<Object>,
    valueType: string,
};

const ValueField = ({ onChange, selectedValue, valueOptions, valueType }: Props) => {
    const isValueSet = selectedValue.length > 0;

    switch (valueType) {
        case 'string':
            return (
                <div className="filter-dropdown-text-field-container">
                    <TextInput
                        hideLabel
                        label="String input"
                        name="string field"
                        onChange={e => onChange([e.target.value])}
                        placeholder="Enter a string"
                        value={isValueSet ? selectedValue[0] : null}
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
                        onChange={e => onChange([e.target.value])}
                        placeholder="Enter a number"
                        value={isValueSet ? selectedValue[0] : null}
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
                        onChange={e => onChange([e.target.value])}
                        placeholder="Enter a float"
                        value={isValueSet ? selectedValue[0] : null}
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
                        value={isValueSet && selectedValue[0] !== '' ? new Date(selectedValue[0]) : undefined}
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
                    selectedValue={isValueSet ? selectedValue[0] : null}
                />
            );
        case 'multi-enum':
            return (
                <MultiSelectField
                    fieldType={VALUE}
                    onChange={e => onChange(e.map(option => option.value))}
                    options={valueOptions}
                    placeholder={<FormattedMessage {...messages.selectValuePlaceholderText} />}
                    selectedValues={selectedValue}
                />
            );
        default:
            return null;
    }
};

export default ValueField;
