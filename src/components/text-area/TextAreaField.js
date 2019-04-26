// @flow

import * as React from 'react';
import getProp from 'lodash/get';
import type { FieldProps } from 'formik';

import TextAreaPrimitive from './TextArea';
import type { TextAreaProps } from './TextArea';

type Props = TextAreaProps & FieldProps;

const TextAreaField = ({ field, form, isRequired, ...rest }: Props) => {
    const { name } = field;
    const { errors, touched } = form;
    const isTouched = getProp(touched, name);
    const error = isTouched ? getProp(errors, name) : null;
    return <TextAreaPrimitive {...field} {...rest} error={error} hideOptionalLabel={isRequired} />;
};

export default TextAreaField;
