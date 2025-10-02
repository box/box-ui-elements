import * as React from 'react';
import { ButtonType } from '../button';
export interface PlainButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    /** Contents of the plain button */
    children?: React.ReactNode;
    /** Custom class name for the plain button */
    className?: string;
    /** Function to get the DOM reference to the html button */
    getDOMRef?: React.LegacyRef<HTMLButtonElement>;
    /** Whether this button should be functionally disabled but still react on hover/focus for tooltips */
    isDisabled?: boolean;
    /** onClick handler for the button */
    onClick?: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
    /** Type of the button - submit, button, reset */
    type?: ButtonType;
}
declare const PlainButton: ({ children, className, getDOMRef, isDisabled, type, ...rest }: PlainButtonProps) => React.JSX.Element;
export default PlainButton;
