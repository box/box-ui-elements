import * as React from 'react';
import { FieldProps } from 'formik';

import RadioButton, { RadioButtonProps } from './RadioButton';

export interface RadioButtonFieldProps extends FieldProps, RadioButtonProps {}

const RadioButtonField = ({ field, form, value, ...rest }: RadioButtonFieldProps) => {
    const { value: fieldValue, ...fieldRest } = field;
    return <RadioButton {...fieldRest} {...rest} value={value} isSelected={value === fieldValue} />;
};

export default RadioButtonField;
