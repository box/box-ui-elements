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
    const styles = classNames('bdl-Pill', {
        'bdl-is-selected': isSelected && !isDisabled,
        'bdl-is-invalid': !isValid,
        'bdl-is-disabled': isDisabled,
    });
    const onClick = isDisabled ? noop : onRemove;

    return (
        <span className={styles}>
            <span className="bdl-Pill-text">{text}</span>
            <span aria-hidden="true" className="bdl-CloseButton" onClick={onClick}>
                ✕
            </span>
        </span>
    );
};

export default Pill;
