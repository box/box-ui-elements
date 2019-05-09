// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import isNaN from 'lodash/isNaN';

import DatePicker from '../../../../components/date-picker';
import SingleSelectField from '../../../../components/select-field/SingleSelectField';
import MultiSelectField from '../../../../components/select-field/MultiSelectField';
import TextInput from '../../../../components/text-input';
import { DATE, ENUM, FLOAT, MULTI_SELECT, NUMBER, STRING, VALUE } from '../../constants';
import messages from '../../messages';
import type { ConditionValueType } from '../../flowTypes';

import '../../styles/Condition.scss';

type Props = {
    error?: React.Node,
    onChange: (value: Array<ConditionValueType>) => void,
    selectedValues: Array<ConditionValueType>,
    valueOptions: Array<Object>,
    valueType: string,
};

const getDateValue = selectedValues => {
    if (selectedValues.length === 0 || selectedValues[0] === null) {
        return undefined;
    }

    const value = selectedValues[0];
    const date = new Date(value);
    if (!isNaN(date.valueOf())) {
        return date;
    }

    throw new Error('Expected Date');
};

const getStringValue = selectedValues => {
    if (selectedValues.length === 0) {
        return undefined;
    }

    const value = selectedValues[0];
    if (typeof value === 'string') {
        return value !== '' ? value : null;
    }

    throw new Error('Expected string');
};

const ValueField = ({ error, onChange, selectedValues, valueOptions, valueType }: Props) => {
    const value = selectedValues.length > 0 ? selectedValues[0] : '';
    const onInputChange = e => {
        return e.target.value !== '' ? onChange([e.target.value]) : onChange([]);
    };

    switch (valueType) {
        case STRING:
        case NUMBER:
        case FLOAT:
            return (
                <div className="filter-dropdown-text-field-container">
                    <TextInput
                        error={error}
                        errorPosition="middle-left"
                        hideLabel
                        label="Text Input"
                        name="text"
                        onChange={onInputChange}
                        placeholder={`Enter ${valueType === STRING ? 'value' : 'a number'}`}
                        value={value}
                    />
                </div>
            );
        case DATE:
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
                        onChange={date => onChange([date])}
                        placeholder="Date"
                        value={getDateValue(selectedValues)}
                    />
                </div>
            );
        case ENUM:
            return (
                <SingleSelectField
                    fieldType={VALUE}
                    onChange={e => onChange([e.value])}
                    options={valueOptions}
                    placeholder={<FormattedMessage {...messages.selectValuePlaceholderText} />}
                    selectedValue={getStringValue(selectedValues)}
                />
            );
        case MULTI_SELECT:
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
