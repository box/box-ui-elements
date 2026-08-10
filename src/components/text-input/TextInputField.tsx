import * as React from 'react';
import getProp from 'lodash/get';
import type { FieldProps } from 'formik';

import TextInputPrimitive from './TextInput';
import type { TextInputProps } from './TextInput';

export interface TextInputFieldProps extends Omit<TextInputProps, 'form'>, FieldProps {
    /** Ref forwarded to the underlying input element as inputRef */
    innerRef?: (instance: HTMLInputElement | null) => void;
}

const TextInputField = ({ field, form, innerRef, isRequired, ...rest }: TextInputFieldProps) => {
    const { name } = field;
    const { errors, touched } = form;
    const isTouched = getProp(touched, name);
    const error = isTouched ? getProp(errors, name) : null;
    return (
        <TextInputPrimitive
            {...field}
            {...rest}
            inputRef={innerRef}
            error={error as React.ReactNode}
            hideOptionalLabel={isRequired}
        />
    );
};

export default TextInputField;
