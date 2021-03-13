import * as React from 'react';
import classnames from 'classnames';
import { defineMessages, injectIntl, FormattedMessage, WrappedComponentProps } from 'react-intl';
import Tooltip, { TooltipPosition, TooltipTheme } from '../tooltip';

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
    hasDefaultTime?: boolean;
    onBlur?: Function;
    onChange?: Function;
}

const VALID_TIME_REGEX = /[0-9]{1,2}.?.?.?[0-9]{0,2}\s?[AaPp]?\.?\s?[Mm]?/;
const PM_REGEX = /[Pp]\.?\s?[Mm]/;
const NUMBER_REGEX = /[0-9]{1,2}/g;
const TWELVE_HOURS = 12;
const DEFAULT_PARSED_TIME = { hours: 0, minutes: 0 };

const isValidTime = (input?: string): boolean => {
    return !!input && VALID_TIME_REGEX.test(input);
};

const parseTimeFromString = (input?: string): { hours: number; minutes: number } => {
    if (!input) return DEFAULT_PARSED_TIME;

    const timeArray = input.match(NUMBER_REGEX);
    if (!timeArray || !timeArray.length) return DEFAULT_PARSED_TIME;

    const hasPMNotation = PM_REGEX.test(input);
    let [hours, minutes] = timeArray;
    if (hours && minutes && hours.length > minutes.length) {
        minutes = hours[1] + minutes;
        hours = hours[0];
    }

    const numericHours = parseInt(hours, 10);
    const numericMinutes = minutes ? parseInt(minutes, 10) : 0;

    return {
        hours: hasPMNotation && numericHours < TWELVE_HOURS ? numericHours + TWELVE_HOURS : numericHours,
        minutes: numericMinutes,
    };
};

const TimeInput = ({
    className,
    errorTooltipPosition = TooltipPosition.MIDDLE_RIGHT,
    hasDefaultTime = true,
    intl,
    onBlur,
    onChange,
}: TimeInputProps) => {
    const [displayTime, setDisplayTime] = React.useState<string | undefined>(
        hasDefaultTime ? intl.formatTime(new Date()) : undefined,
    );
    const [inputTimeString, setInputTimeString] = React.useState<string | undefined>(undefined);
    const [error, setError] = React.useState<React.ReactElement | undefined>(undefined);

    const classes = classnames(className, 'bdl-TextInput', {
        'show-error': error,
    });

    React.useEffect(() => {
        if (!inputTimeString) return;

        if (isValidTime(inputTimeString)) {
            const { hours: parsedHours, minutes: parsedMinutes } = parseTimeFromString(inputTimeString);
            const date = new Date();
            date.setHours(parsedHours);
            date.setMinutes(parsedMinutes);
            setDisplayTime(intl.formatTime(date));
        } else {
            setError(<FormattedMessage {...messages.invalidTimeError} />);
        }
    }, [intl, inputTimeString]);

    const handleBlur = () => {
        setInputTimeString(displayTime);
        if (onBlur) onBlur(displayTime);
    };

    const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = event;
        setDisplayTime(value);
        if (error) setError(undefined);
        if (onChange) onChange(value);
    };

    return (
        <Tooltip isShown={!!error} position={errorTooltipPosition} text={error || ''} theme={TooltipTheme.ERROR}>
            <input className={classes} onBlur={handleBlur} onChange={handleChange} type="text" value={displayTime} />
        </Tooltip>
    );
};

export { TimeInput as TimeInputComponent };
export default injectIntl(TimeInput);
