import * as React from 'react';
import classnames from 'classnames';
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
    onBlur?: ({ displayTime, hours, minutes }: { displayTime: string; hours: number; minutes: number }) => void;
    /** shouldAutoBlur - Whether the field should automatically blur when form submit keys are pressed */
    shouldAutoBlur?: boolean;
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
    shouldAutoBlur = true,
}: TimeInputProps) => {
    const [displayTime, setDisplayTime] = React.useState<string | undefined>(
        initialDate ? intl.formatTime(initialDate) : '',
    );
    const [error, setError] = React.useState<React.ReactElement | undefined>(undefined);

    /**
     * Handle blur events.
     * Parse and reformat the current display time (as entered by the user).
     */
    const handleBlur = () => {
        try {
            const { hours: parsedHours, minutes: parsedMinutes } = parseTimeFromString(displayTime);
            const date = new Date();
            date.setHours(parsedHours);
            date.setMinutes(parsedMinutes);
            const newDisplayTime = intl.formatTime(date);
            setDisplayTime(newDisplayTime);
            if (onBlur) onBlur({ displayTime: newDisplayTime, hours: parsedHours, minutes: parsedMinutes });
        } catch (e) {
            setError(<FormattedMessage {...messages.invalidTimeError} />);
        }
    };

    /**
     * Handle keydown events if shouldAutoBlur is true.
     * If the user pressed Ctrl+Enter or Cmd+Enter (as in a form submit),
     * blur the input field automatically, which will trigger handleBlur() above.
     * @param event - KeyboardEvent
     */
    const handleKeyDown = (event: React.KeyboardEvent) => {
        const { ctrlKey, key, metaKey } = event;
        const autoBlurKeyPressed = AUTO_BLUR_KEYS[key] || metaKey || ctrlKey;
        if (autoBlurKeyPressed) handleBlur();
    };

    /**
     * Handle change events.
     * Update the value of the display time to match what the user typed.
     * @param event - ChangeEvent
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value: updatedValue },
        } = event;
        setDisplayTime(updatedValue);
        if (error) setError(undefined);
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
            {...(shouldAutoBlur ? { onKeyDown: handleKeyDown } : {})}
        />
    );
};

export { TimeInput as TimeInputComponent };
export default injectIntl(TimeInput);
