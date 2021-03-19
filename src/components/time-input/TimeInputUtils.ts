const VALID_TIME_REGEX = /[0-9]{1,2}.?.?.?[0-9]{0,2}\s?[AaPp]?\.?\s?[Mm]?/;
const AM_REGEX = /[Aa]\.?\s?[Mm]/;
const PM_REGEX = /[Pp]\.?\s?[Mm]/;
const NUMBER_REGEX = /[0-9]{1,2}/g;
const TWELVE_HOURS = 12;
const DEFAULT_PARSED_TIME = { hours: 0, minutes: 0 };
const VALID_NUMBER_COUNT = 2;

/**
 * Check that the input string is in a valid time format
 * @param input - input string to test
 * @returns
 */
export const isValidTime = (input?: string): boolean => {
    return !!input && VALID_TIME_REGEX.test(input);
};

/**
 * Parse an input string and convert it into an object containing numerical hours and minutes.
 * @param input - input string to be converted
 * @returns
 */
export const parseTimeFromString = (input?: string): { hours: number; minutes: number } => {
    if (!input) return DEFAULT_PARSED_TIME;
    if (!isValidTime(input)) {
        throw new SyntaxError();
    }

    const timeArray = input.match(NUMBER_REGEX);
    if (!timeArray || !timeArray.length) return DEFAULT_PARSED_TIME;
    if (timeArray.length > VALID_NUMBER_COUNT) {
        throw new SyntaxError();
    }

    const hasAMNotation = AM_REGEX.test(input);
    const hasPMNotation = PM_REGEX.test(input);
    let [hours, minutes] = timeArray;
    if (hours && minutes && hours.length > minutes.length) {
        minutes = hours[1] + minutes;
        hours = hours[0];
    }

    const numericMinutes = minutes ? parseInt(minutes, 10) : 0;

    // Set the hours to "0" if the input translates to midnight
    // Convert the hours to 24-hour format if this is a PM time
    let numericHours = parseInt(hours, 10);
    if (hasAMNotation && numericHours === TWELVE_HOURS) {
        numericHours = 0;
    } else if (hasPMNotation && numericHours < TWELVE_HOURS) {
        numericHours += TWELVE_HOURS;
    }

    return {
        hours: numericHours,
        minutes: numericMinutes,
    };
};
