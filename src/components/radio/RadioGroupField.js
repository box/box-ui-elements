// @flow

import * as React from 'react';
import type { FieldProps } from 'formik';

import RadioGroupPrimitive from './RadioGroup';
import type { RadioGroupProps } from './RadioGroup';

type Props = RadioGroupProps & FieldProps;

const RadioGroupField = ({ field, form, ...rest }: Props) => {
    const { value } = field;
    return <RadioGroupPrimitive key={value} {...field} {...rest} />;
};

export default RadioGroupField;
