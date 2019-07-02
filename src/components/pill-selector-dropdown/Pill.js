// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
    isDisabled?: boolean,
    isSelected?: boolean,
    isValid?: boolean,
    onRemove: Function,
    text: string,
};

const Pill = ({ isDisabled = false, isSelected = false, isValid = true, onRemove, text }: Props) => {
    const removeFn = isDisabled ? undefined : onRemove;
    return (
        <span
            className={classNames('pill', {
                'is-selected': isSelected,
                'is-invalid': !isValid,
                'is-disabled': isDisabled,
            })}
        >
            <span className="pill-text">{text}</span>
            <span aria-hidden="true" className="close-btn" onClick={removeFn}>
                ✕
            </span>
        </span>
    );
};

export default Pill;
