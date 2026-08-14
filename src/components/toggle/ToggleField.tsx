import * as React from 'react';
import type { FieldProps } from 'formik';

import TogglePrimitive from './Toggle';
import type { ToggleProps } from './Toggle';

export interface ToggleFieldProps extends Omit<ToggleProps, 'form'>, FieldProps {}

const ToggleField = ({
    field,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip Formik form and meta bags from forwarded props
    form,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip Formik form and meta bags from forwarded props
    meta,
    ...rest
}: ToggleFieldProps) => {
    const { value } = field;
    return <TogglePrimitive {...field} {...rest} isOn={!!value} />;
};

export default ToggleField;
