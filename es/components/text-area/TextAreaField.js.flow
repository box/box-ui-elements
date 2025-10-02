// @flow

import * as React from 'react';
import getProp from 'lodash/get';
import type { FieldProps } from 'formik';

import TextAreaPrimitive from './TextArea';
import type { TextAreaProps } from './TextArea';

type Props = TextAreaProps & FieldProps & { innerRef?: (instance: any) => void };

const TextAreaField = ({ field, form, innerRef, isRequired, ...rest }: Props) => {
    const { name } = field;
    const { errors, touched } = form;
    const isTouched = getProp(touched, name);
    const error = isTouched ? getProp(errors, name) : null;
    return (
        <TextAreaPrimitive {...field} {...rest} textareaRef={innerRef} error={error} hideOptionalLabel={isRequired} />
    );
};

export default TextAreaField;
