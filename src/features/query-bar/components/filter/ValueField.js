// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import DatePicker from '../../../../components/date-picker';
import SingleSelectField from '../../../../components/select-field/SingleSelectField';
import TextInput from '../../../../components/text-input';
import { VALUE } from '../../constants';
import messages from '../../messages';

import '../../styles/Condition.scss';

type Props = {
    onChange: (value: String) => void,
    selectedValue?: string | number,
    valueOptions: Array<Object>,
    valueType: string,
};

const ValueField = ({ onChange, selectedValue, valueOptions, valueType }: Props) => {
    switch (valueType) {
        case 'string':
            return (
                <div className="filter-dropdown-text-field-container">
                    <TextInput
                        hideLabel
                        label="String input"
                        name="string field"
                        onChange={e => onChange(e.target.value)}
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
                        onChange={e => onChange(e.target.value)}
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
                        label="Float input"
                        name="float field"
                        onChange={e => onChange(e.target.value)}
                        placeholder="Enter a float"
                        value={selectedValue || ''}
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
                        onChange={e => onChange(e.toString())}
                        placeholder="Date"
                        value={selectedValue ? new Date(selectedValue) : undefined}
                    />
                </div>
            );
        case 'enum':
            return (
                <SingleSelectField
                    fieldType={VALUE}
                    onChange={e => onChange(e.value)}
                    options={valueOptions}
                    placeholder={<FormattedMessage {...messages.selectValuePlaceholderText} />}
                    selectedValue={selectedValue}
                />
            );
        default:
            return null;
    }
};

export default ValueField;
