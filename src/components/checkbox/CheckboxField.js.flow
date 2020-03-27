// @flow

import * as React from 'react';
import type { FieldProps } from 'formik';

import CheckboxPrimitive from './Checkbox';
import type { CheckboxProps } from './Checkbox';

type Props = CheckboxProps & FieldProps;

const CheckboxField = ({ field, form, ...rest }: Props) => {
    const { value } = field;
    return <CheckboxPrimitive {...field} {...rest} isChecked={!!value} />;
};

export default CheckboxField;
