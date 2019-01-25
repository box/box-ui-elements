// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
    isSelected?: boolean,
    onRemove: Function,
    text: string,
};

const Pill = ({ isSelected = false, onRemove, text }: Props) => (
    <span className={classNames('pill', { 'is-selected': isSelected })}>
        <span className="pill-text">{text}</span>
        <span aria-hidden="true" className="close-btn" onClick={onRemove}>
            ✕
        </span>
    </span>
);

export default Pill;
