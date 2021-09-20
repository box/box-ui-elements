import * as React from 'react';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import { defineMessages, injectIntl, FormattedMessage, WrappedComponentProps } from 'react-intl';
import { TooltipPosition } from '../tooltip';
import { parseTimeFromString } from './TimeInputUtils';
// @ts-ignore flow import
import TextInput from '../text-input';
import ClockBadge16 from '../../icon/line/ClockBadge16';
// @ts-ignore flow import
import { DEFAULT_FORMAT_DEBOUNCE } from '../../constants';

import './TimeInput.scss';

const messages = defineMessages({
    invalidTimeError: {
        defaultMessage: 'Invalid time format. Enter a time in the format HH:MM A.',
        description: 'Error message for invalid time formats. "HH:MM A" should be localized.',
        id: 'boxui.timeInput.invalidTimeError',
    },
    emptyTimeError: {
        defaultMessage: 'Required field. Enter a time in the format HH:MM A.',
        description: 'Error message for empty time formats. "HH:MM A" should be localized.',
        id: 'boxui.timeInput.emptyTimeError',
    },
});

type TimeInputEventHandler = ({
    displayTime,
    hours,
    minutes,
}: {
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

const TimeInput = ({
    className,
    errorTooltipPosition = TooltipPosition.MIDDLE_RIGHT,
    hideLabel = true,
    initialDate,
    innerRef,
    intl,
    isRequired = true,
    label,
    onBlur,
    onChange,
    onError,
}: TimeInputProps) => {
    const [displayTime, setDisplayTime] = React.useState<string>(initialDate ? intl.formatTime(initialDate) : '');
    const [error, setError] = React.useState<React.ReactElement | undefined>(undefined);

    /**
     * Handle blur events.
     * Parse and reformat the current display time (as entered by the user).
     * @param latestValue - string
     * @returns
     */
    const formatDisplayTime = (latestValue: string = displayTime) => {
        try {
            const { hours: parsedHours, minutes: parsedMinutes } = parseTimeFromString(latestValue, isRequired);
            const date = new Date();
            date.setHours(parsedHours);
            date.setMinutes(parsedMinutes);
            const newDisplayTime = intl.formatTime(date);
            setDisplayTime(newDisplayTime);
            if (onBlur) onBlur({ displayTime: newDisplayTime, hours: parsedHours, minutes: parsedMinutes });
            if (onChange) onChange({ displayTime: newDisplayTime, hours: parsedHours, minutes: parsedMinutes });
        } catch (e) {
            const errorMessage = latestValue ? messages.invalidTimeError : messages.emptyTimeError;
            const updatedError = <FormattedMessage {...errorMessage} />;
            setError(updatedError);
            if (onError) onError(updatedError);
        }
    };

    /**
     * Debounce formatDisplayTime() for use in handleChange().
     * useCallback() memoizes the debounced function, so that the debounced function
     * is not recreated on every re-render triggered by handleChange().
     */
    const debouncedFormatDisplayTime = React.useCallback(
        debounce((latestValue: string) => formatDisplayTime(latestValue), DEFAULT_FORMAT_DEBOUNCE),
        [],
    );

    /**
     * Handle change events.
     * Clear errors, update the value of the display time to match what the user typed,
     * and call the debounced version of formatDisplayTime().
     * @param event - ChangeEvent
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value: updatedValue },
        } = event;
        setDisplayTime(updatedValue);
        if (error) setError(undefined);
        debouncedFormatDisplayTime(updatedValue);
    };

    /**
     * Handle blur events.
     */
    const handleBlur = () => {
        formatDisplayTime(displayTime);
    };

    return (
        <TextInput
            className={classnames('bdl-TimeInput', className)}
            error={error}
            hideLabel={hideLabel}
            icon={<ClockBadge16 className="bdl-TimeInput-icon" />}
            inputRef={innerRef}
            isRequired={isRequired}
            label={label}
            onBlur={handleBlur}
            onChange={handleChange}
            position={errorTooltipPosition}
            type="text"
            value={displayTime}
        />
    );
};

export { TimeInput as TimeInputComponent };
export default injectIntl(TimeInput);
