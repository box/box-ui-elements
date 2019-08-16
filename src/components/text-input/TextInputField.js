// @flow

import * as React from 'react';
import getProp from 'lodash/get';
import type { FieldProps } from 'formik';

import TextInputPrimitive from './TextInput';
import type { TextInputProps } from './TextInput';

type Props = TextInputProps & FieldProps & { innerRef?: (instance: any) => void };

const TextInputField = ({ field, form, innerRef, isRequired, ...rest }: Props) => {
    const { name } = field;
    const { errors, touched } = form;
    const isTouched = getProp(touched, name);
    const error = isTouched ? getProp(errors, name) : null;
    return <TextInputPrimitive {...field} {...rest} inputRef={innerRef} error={error} hideOptionalLabel={isRequired} />;
};

export default TextInputField;
