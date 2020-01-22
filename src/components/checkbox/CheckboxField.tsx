import * as React from 'react';
import { FieldProps } from 'formik';

import CheckboxPrimitive, { CheckboxProps } from './Checkbox';

const CheckboxField = ({ field, ...rest }: CheckboxProps & FieldProps) => {
    const { value } = field;
    return <CheckboxPrimitive {...field} {...rest} isChecked={!!value} />;
};

export default CheckboxField;
