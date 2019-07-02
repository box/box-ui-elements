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
    const styles = classNames('pill', {
        'is-selected': isSelected && !isDisabled,
        'is-invalid': !isValid,
        'is-disabled': isDisabled,
    });
    return (
        <span className={styles}>
            <span className="pill-text">{text}</span>
            <button aria-hidden="true" className="close-btn" disabled={isDisabled} onClick={onRemove} type="button">
                ✕
            </button>
        </span>
    );
};

export default Pill;
