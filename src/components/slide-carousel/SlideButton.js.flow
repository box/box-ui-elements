// @flow
import * as React from 'react';

import PlainButton from '../plain-button';

type Props = {
    buttonRef?: Function,
    isSelected?: boolean,
    onClick?: Function,
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
