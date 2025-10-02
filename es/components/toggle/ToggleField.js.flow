// @flow

import * as React from 'react';
import type { FieldProps } from 'formik';

import TogglePrimitive from './Toggle';
import type { ToggleProps } from './Toggle';

type Props = ToggleProps & FieldProps;

const ToggleField = ({ field, form, ...rest }: Props) => {
    const { value } = field;
    return <TogglePrimitive {...field} {...rest} isOn={!!value} />;
};

export default ToggleField;
