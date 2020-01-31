import * as React from 'react';
import { FieldProps } from 'formik';

import RadioGroupPrimitive, { RadioGroupProps } from './RadioGroup';

export type RadioGroupFieldProps = Partial<FieldProps> & RadioGroupProps;

const RadioGroupField = ({ field, ...rest }: RadioGroupFieldProps) => {
    if (!field) {
        return <RadioGroupPrimitive value="" {...rest} />;
    }
    const { value } = field;
    return <RadioGroupPrimitive key={value} {...field} {...rest} />;
};

export default RadioGroupField;
