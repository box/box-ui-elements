import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';

export interface PillProps {
    /** Whether the pill is disabled and cannot be removed */
    isDisabled?: boolean;
    /** Whether the pill is currently selected */
    isSelected?: boolean;
    /** Whether the pill value is valid */
    isValid?: boolean;
    /** Called when the remove control is clicked */
    onRemove: () => void;
    /** Display text for the pill */
    text: string;
}

const Pill = ({ isDisabled = false, isSelected = false, isValid = true, onRemove, text }: PillProps) => {
    const styles = classNames('bdl-Pill', 'pill', {
        'is-selected': isSelected && !isDisabled,
        'is-invalid': !isValid,
        'is-disabled': isDisabled,
        'bdl-is-disabled': isDisabled,
    });
    const onClick = isDisabled ? noop : onRemove;

    return (
        <span className={styles}>
            <span className="bdl-Pill-text pill-text">{text}</span>
            <span aria-hidden="true" className="close-btn" onClick={onClick}>
                ✕
            </span>
        </span>
    );
};

export default Pill;
