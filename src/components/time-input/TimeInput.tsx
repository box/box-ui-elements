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
import { KEYS } from '../../constants';

import './TimeInput.scss';

const messages = defineMessages({
    invalidTimeError: {
        defaultMessage: 'Invalid time format. Enter a time in the format HH:MM A.',
        description: 'Error message for invalid time formats. "HH:MM A" should be localized.',
        id: 'boxui.timeInput.invalidTimeError',
    },
});

const AUTO_BLUR_KEYS: { [key: string]: boolean } = {
    [KEYS.enter]: true,
    [KEYS.escape]: true,
};

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
    onChange?: TimeInputEventHandler;
    /** shouldAutoFormat - Whether the field should automatically blur when form submit keys are pressed */
    shouldAutoFormat?: boolean;
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
    shouldAutoFormat = true,
}: TimeInputProps) => {
    const [displayTime, setDisplayTime] = React.useState<string>(initialDate ? intl.formatTime(initialDate) : '');
    const [error, setError] = React.useState<React.ReactElement | undefined>(undefined);

    /**
     * Handle blur events.
     * Parse and reformat the current display time (as entered by the user).
     * @param latestValue - string
     * @param callback - onBlur, onChange, or a combination of the two
     * @returns
     */
    const formatDisplayTime = (latestValue: string = displayTime, callback?: TimeInputEventHandler) => {
        if (!latestValue) return;
        try {
            const { hours: parsedHours, minutes: parsedMinutes } = parseTimeFromString(latestValue);
            const date = new Date();
            date.setHours(parsedHours);
            date.setMinutes(parsedMinutes);
            const newDisplayTime = intl.formatTime(date);
            setDisplayTime(newDisplayTime);
            if (callback) callback({ displayTime: newDisplayTime, hours: parsedHours, minutes: parsedMinutes });
        } catch (e) {
            setError(<FormattedMessage {...messages.invalidTimeError} />);
        }
    };

    /**
     * Handle keydown events if shouldAutoFormat is true.
     * If the user pressed Ctrl+Enter or Cmd+Enter (as in a form submit), call formatDisplayTime().
     * @param event - KeyboardEvent
     */
    const handleKeyDown = (event: React.KeyboardEvent) => {
        const { ctrlKey, key, metaKey } = event;
        const autoBlurKeyPressed = AUTO_BLUR_KEYS[key] || metaKey || ctrlKey;
        if (autoBlurKeyPressed) {
            formatDisplayTime(displayTime, parsedData => {
                if (onBlur) onBlur(parsedData);
                if (onChange) onChange(parsedData);
            });
        }
    };

    /**
     * Debounce formatDisplayTime() for use in handleChange().
     * useCallback() memoizes the debounced function, so that the debounced function
     * is not recreated on every re-render triggered by handleChange().
     */
    const debouncedFormatDisplayTime = React.useCallback(
        debounce((latestValue: string) => formatDisplayTime(latestValue, onChange), 2000),
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
        if (shouldAutoFormat) debouncedFormatDisplayTime(updatedValue);
    };

    /**
     * Handle blur events.
     */
    const handleBlur = () => {
        formatDisplayTime(displayTime, onBlur);
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
            {...(shouldAutoFormat ? { onKeyDown: handleKeyDown } : {})}
        />
    );
};

export { TimeInput as TimeInputComponent };
export default injectIntl(TimeInput);
