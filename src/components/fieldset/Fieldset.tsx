import * as React from 'react';

import './Fieldset.scss';

export interface FieldsetProps {
    children?: React.ReactNode;
    className?: string;
    title: React.ReactNode;
}

const Fieldset = ({ children, className = '', title, ...rest }: FieldsetProps) => (
    <fieldset className={`fieldset ${className}`} {...rest}>
        <legend className="label">{title}</legend>
        {children}
    </fieldset>
);

export default Fieldset;
