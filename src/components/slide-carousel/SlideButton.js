// @flow
import React from 'react';

import PlainButton from '../plain-button';

type Props = {
    buttonRef?: Function,
    onClick?: Function,
    isSelected?: boolean,
};

const SlideButton = ({ buttonRef, onClick, isSelected = false, ...rest }: Props) => (
    <PlainButton
        aria-selected={isSelected}
        className={`slide-selector ${isSelected ? 'is-selected' : ''}`}
        getDOMRef={buttonRef}
        onClick={onClick}
        role="tab"
        type="button"
        {...rest}
    />
);

export default SlideButton;
