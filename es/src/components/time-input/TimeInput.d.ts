import * as React from 'react';
import { WrappedComponentProps } from 'react-intl';
import { TooltipPosition } from '../tooltip';
import './TimeInput.scss';
type TimeInputEventHandler = ({ displayTime, hours, minutes, }: {
    displayTime: string;
    hours: number;
    minutes: number;
}) => void;
export interface TimeInputProps extends WrappedComponentProps {
    /** className - CSS class for the component */
    className?: string;
    /** errorTooltipPosition - Position for the error tooltip */
    errorTooltipPosition?: TooltipPosition;
    /** hideLabel - Whether the label should be hidden */
    hideLabel?: boolean;
    /** label - Label for the time input */
    label?: React.ReactNode;
    /** initialDate - Date object for initializing the time input */
    initialDate?: Date;
    /** innerRef - Ref for the time input */
    innerRef?: React.Ref<HTMLInputElement>;
    /** isRequired - Whether the time input is required */
    isRequired?: boolean;
    /**
     * onBlur - Function to call when the user blurs out of the time input
     * The parsed display time, along with the hours and minutes in 24-hour format, will be passed to the handler.
     */
    onBlur?: TimeInputEventHandler;
    /**
     * onChange - Function to call when the user changes the value of the time input
     * The parsed display time, along with the hours and minutes in 24-hour format, will be passed to the handler.
     */
    onChange?: TimeInputEventHandler;
    onError?: (error: React.ReactNode) => void;
}
declare const TimeInput: ({ className, errorTooltipPosition, hideLabel, initialDate, innerRef, intl, isRequired, label, onBlur, onChange, onError, }: TimeInputProps) => React.JSX.Element;
export { TimeInput as TimeInputComponent };
declare const _default: React.FC<import("react-intl").WithIntlProps<TimeInputProps>> & {
    WrappedComponent: React.ComponentType<TimeInputProps>;
};
export default _default;
