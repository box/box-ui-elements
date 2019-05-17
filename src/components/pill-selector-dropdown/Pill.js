// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
    isSelected?: boolean,
    isValid?: boolean,
    onRemove: Function,
    text: string,
};

const Pill = ({ isSelected = false, isValid = true, onRemove, text }: Props) => (
    <span className={classNames('pill', { 'is-selected': isSelected, 'is-invalid': !isValid })}>
        <span className="pill-text">{text}</span>
        <span aria-hidden="true" className="close-btn" onClick={onRemove}>
            ✕
        </span>
    </span>
);

export default Pill;
