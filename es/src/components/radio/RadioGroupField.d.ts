import * as React from 'react';
import { FieldProps } from 'formik';
import { RadioGroupProps } from './RadioGroup';
export type RadioGroupFieldProps = Partial<FieldProps> & RadioGroupProps;
declare const RadioGroupField: ({ field, ...rest }: RadioGroupFieldProps) => React.JSX.Element;
export default RadioGroupField;
