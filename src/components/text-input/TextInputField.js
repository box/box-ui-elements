// @flow

import * as React from 'react';
import getProp from 'lodash/get';
import type { FieldProps } from 'formik';

import TextInputPrimitive from './TextInput';
import type { TextInputProps } from './TextInput';

type Props = TextInputProps & FieldProps;

const TextInputField = ({ field, form, isRequired, ...rest }: Props) => {
    const { name } = field;
    const { errors, touched } = form;
    const isTouched = getProp(touched, name);
    const error = isTouched ? getProp(errors, name) : null;
    return <TextInputPrimitive {...field} {...rest} error={error} hideOptionalLabel={isRequired} />;
};

export default TextInputField;
