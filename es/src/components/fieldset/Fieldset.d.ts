import * as React from 'react';
import './Fieldset.scss';
export interface FieldsetProps {
    children?: React.ReactNode;
    className?: string;
    title: React.ReactNode;
}
declare const Fieldset: ({ children, className, title, ...rest }: FieldsetProps) => React.JSX.Element;
export default Fieldset;
