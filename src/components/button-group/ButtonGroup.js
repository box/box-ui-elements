// @flow
import * as React from 'react';

import './ButtonGroup.scss';

type Props = {
    /** A group of buttons */
    children: React.Node,
    /** Class name for ButtonGroup */
    className?: string,
    isDisabled?: boolean,
};

const ButtonGroup = ({ children, className = '', isDisabled }: Props) => (
    <div className={`box-ui-component btn-group ${className} ${isDisabled ? 'is-disabled' : ''}`}>{children}</div>
);

export default ButtonGroup;
