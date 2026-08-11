import * as React from 'react';
import getProp from 'lodash/get';
import type { FieldProps } from 'formik';

import TextAreaPrimitive from './TextArea';
import type { TextAreaProps } from './TextArea';

export interface TextAreaFieldProps extends Omit<TextAreaProps, 'form'>, FieldProps {
    /** Ref forwarded to the underlying textarea element as textareaRef */
    innerRef?: (instance: HTMLTextAreaElement | null) => void;
}

const TextAreaField = ({ field, form, innerRef, isRequired, ...rest }: TextAreaFieldProps) => {
    const { name } = field;
    const { errors, touched } = form;
    const isTouched = getProp(touched, name);
    const error = isTouched ? getProp(errors, name) : null;
    return (
        <TextAreaPrimitive
            {...field}
            {...rest}
            textareaRef={innerRef}
            error={error as React.ReactNode}
            hideOptionalLabel={isRequired}
        />
    );
};

export default TextAreaField;
