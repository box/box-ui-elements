import * as React from 'react';
import { FieldProps } from 'formik';

import RadioGroupPrimitive, { RadioGroupProps } from './RadioGroup';

export interface RadioGroupFieldProps extends FieldProps, RadioGroupProps {}

const RadioGroupField = ({ field, form, ...rest }: RadioGroupFieldProps) => {
    const { value } = field;
    return <RadioGroupPrimitive key={value} {...field} {...rest} />;
};

export default RadioGroupField;
