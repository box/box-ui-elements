import * as React from 'react';
import { FieldProps } from 'formik';
import { CheckboxProps } from './Checkbox';
export type CheckboxFieldProps = Partial<FieldProps> & CheckboxProps;
declare const CheckboxField: ({ field, ...rest }: CheckboxFieldProps) => React.JSX.Element;
export default CheckboxField;
