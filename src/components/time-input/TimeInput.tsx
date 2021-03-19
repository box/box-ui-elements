import * as React from 'react';
import { defineMessages, injectIntl, FormattedMessage, WrappedComponentProps } from 'react-intl';
import { TooltipPosition } from '../tooltip';
import { parseTimeFromString } from './TimeInputUtils';
// @ts-ignore flow import
import TextInput from '../text-input';

import '../text-input/TextInput.scss';

const messages = defineMessages({
    invalidTimeError: {
        defaultMessage: 'Invalid time format. Enter a time in the format HH:MM A.',
        description: 'Error message for invalid time formats. "HH:MM A" should be localized.',
        id: 'boxui.timeInput.invalidTimeError',
    },
});
export interface TimeInputProps extends WrappedComponentProps {
    className?: string;
    errorTooltipPosition?: TooltipPosition;
    hideLabel?: boolean;
    label?: React.ReactNode;
    isRequired?: boolean;
    onBlur?: Function;
    onChange?: Function;
    value?: string;
}

const TimeInput = ({
    className,
    errorTooltipPosition = TooltipPosition.MIDDLE_RIGHT,
    hideLabel = true,
    intl,
    isRequired = true,
    label,
    onBlur,
    onChange,
    value,
}: TimeInputProps) => {
    const [displayTime, setDisplayTime] = React.useState<string | undefined>(
        value ? intl.formatTime(new Date(value)) : intl.formatTime(new Date()),
    );
    const [error, setError] = React.useState<React.ReactElement | undefined>(undefined);

    const handleBlur = () => {
        try {
            const { hours: parsedHours, minutes: parsedMinutes } = parseTimeFromString(displayTime);
            const date = new Date();
            date.setHours(parsedHours);
            date.setMinutes(parsedMinutes);
            const newDisplayTime = intl.formatTime(date);
            setDisplayTime(newDisplayTime);
            if (onBlur) onBlur(newDisplayTime);
        } catch (e) {
            setError(<FormattedMessage {...messages.invalidTimeError} />);
        }
    };

    const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
        const {
            target: { value: updatedValue },
        } = event;
        setDisplayTime(updatedValue);
        if (error) setError(undefined);
        if (onChange) onChange(updatedValue);
    };

    return (
        <TextInput
            className={className}
            error={error}
            hideLabel={hideLabel}
            isRequired={isRequired}
            label={label}
            onBlur={handleBlur}
            onChange={handleChange}
            position={errorTooltipPosition}
            value={displayTime}
        />
    );
};

export { TimeInput as TimeInputComponent };
export default injectIntl(TimeInput);
