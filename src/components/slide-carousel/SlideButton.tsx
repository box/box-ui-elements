import * as React from 'react';

import { ButtonType } from '../button';
import PlainButton, { type PlainButtonProps } from '../plain-button';

export interface SlideButtonProps extends Omit<PlainButtonProps, 'getDOMRef'> {
    /** Ref for the underlying button element */
    buttonRef?: React.LegacyRef<HTMLButtonElement>;
    /** Whether the button represents the selected slide */
    isSelected?: boolean;
    /** Handler invoked when the button is clicked */
    onClick?: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const SlideButton = ({ buttonRef, onClick, isSelected = false, ...rest }: SlideButtonProps) => (
    <PlainButton
        aria-selected={isSelected}
        className={`slide-selector ${isSelected ? 'is-selected' : ''}`}
        getDOMRef={buttonRef}
        onClick={onClick}
        role="tab"
        type={ButtonType.BUTTON}
        {...rest}
    />
);

export default SlideButton;
