// @flow
import * as React from 'react';
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
