// @flow
import React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';

type Props = {
    isDisabled?: boolean,
    isSelected?: boolean,
    isValid?: boolean,
    onRemove: Function,
    text: string,
};

const Pill = ({ isDisabled = false, isSelected = false, isValid = true, onRemove, text }: Props) => {
    const styles = classNames('pill bdl-Pill', {
        'is-selected': isSelected && !isDisabled,
        'is-invalid': !isValid,
        'bdl-is-disabled': isDisabled,
    });
    const onClick = isDisabled ? noop : onRemove;

    return (
        <span className={styles}>
            <span className="pill-text">{text}</span>
            <span aria-hidden="true" className="close-btn" onClick={onClick}>
                ✕
            </span>
        </span>
    );
};

export default Pill;
