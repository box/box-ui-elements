/**
 * Check that the input string is in a valid time format
 * @param input - input string to test
 * @returns
 */
export declare const isValidTime: (input?: string) => boolean;
/**
 * Parse an input string and convert it into an object containing numerical hours and minutes.
 * @param input - input string to be converted
 * @param isRequired - whether the input is required
 * @returns
 */
export declare const parseTimeFromString: (input?: string, isRequired?: boolean) => {
    hours: number;
    minutes: number;
};
