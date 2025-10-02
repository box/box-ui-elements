import * as React from 'react';
import { FieldProps } from 'formik';
import { RadioButtonProps } from './RadioButton';
export type RadioButtonFieldProps = Partial<FieldProps> & RadioButtonProps;
declare const RadioButtonField: ({ field, value, ...rest }: RadioButtonFieldProps) => React.JSX.Element;
export default RadioButtonField;
