// @flow

import * as React from 'react';
import type { FieldProps } from 'formik';

import RadioButton from './RadioButton';
import type { RadioButtonProps } from './RadioButton';

type Props = RadioButtonProps & FieldProps;

const RadioButtonField = ({ field, form, value, ...rest }: Props) => {
    const { value: fieldValue, ...fieldRest } = field;
    return <RadioButton {...fieldRest} {...rest} value={value} isSelected={value === fieldValue} />;
};

export default RadioButtonField;
