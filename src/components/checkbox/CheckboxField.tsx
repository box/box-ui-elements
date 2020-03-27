import * as React from 'react';
import { FieldProps } from 'formik';

import CheckboxPrimitive, { CheckboxProps } from './Checkbox';

export type CheckboxFieldProps = Partial<FieldProps> & CheckboxProps;

const CheckboxField = ({ field, ...rest }: CheckboxFieldProps) => {
    if (!field) {
        return <CheckboxPrimitive {...rest} />;
    }
    const { value } = field;
    return <CheckboxPrimitive {...field} {...rest} isChecked={!!value} />;
};

export default CheckboxField;
