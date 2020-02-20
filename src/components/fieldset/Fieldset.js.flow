// @flow
import * as React from 'react';

import './Fieldset.scss';

type Props = {
    children?: React.Node,
    className?: string,
    title: React.Node,
};

const Fieldset = ({ children, className = '', title, ...rest }: Props) => (
    <fieldset className={`fieldset ${className}`} {...rest}>
        <legend className="label bdl-Label">{title}</legend>
        {children}
    </fieldset>
);

export default Fieldset;
