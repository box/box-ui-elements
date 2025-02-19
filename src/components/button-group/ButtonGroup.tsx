import * as React from 'react';

import './ButtonGroup.scss';

export interface ButtonGroupProps {
    /** A group of buttons */
    children: React.ReactNode;
    /** Class name for ButtonGroup */
    className?: string;
    /** Boolean describing whether the button is disabled or not */
    isDisabled?: boolean;
    /** ARIA role for the button group */
    role?: string;
    /** ARIA label for the button group */
    'aria-label'?: string;
}

const ButtonGroup = ({ children, className = '', isDisabled, role, 'aria-label': ariaLabel }: ButtonGroupProps) => (
    <div className={`btn-group ${className} ${isDisabled ? 'is-disabled' : ''}`} role={role} aria-label={ariaLabel}>
        {children}
    </div>
);

export default ButtonGroup;
