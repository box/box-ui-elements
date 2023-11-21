import * as React from 'react';
import { FieldProps } from 'formik';

import RadioButton, { RadioButtonProps } from './RadioButton';

export type RadioButtonFieldProps = Partial<FieldProps> & RadioButtonProps;

const RadioButtonField = ({ field, value, ...rest }: RadioButtonFieldProps) => {
    if (!field) {
        return <RadioButton value={value} {...rest} />;
    }
    const { value: fieldValue, ...fieldRest } = field;
    return <RadioButton {...fieldRest} {...rest} isSelected={value === fieldValue} value={value} />;
};

export default RadioButtonField;
