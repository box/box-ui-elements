/**
 * @file Utility functions for timestamp formatting and conversion
 */
/**
 * Converts a timestamp representation to seconds
 * @param timestamp The timestamp in milliseconds
 * @returns The total seconds
 */
declare const convertTimestampToSeconds: (timestamp: number) => number;
/**
 * Converts milliseconds to HH:MM:SS format
 * @param timestampInMilliseconds The timestamp in milliseconds
 * @returns The formatted timestamp string in HH:MM:SS format
 */
declare const convertMillisecondsToHMMSS: (timestampInMilliseconds: number) => string;
/**
 * Converts seconds to HH:MM:SS format
 * @param seconds number of seconds
 * @returns The formatted timestamp string in HH:MM:SS format
 */
declare const convertSecondsToHMMSS: (seconds: number) => string;
export { convertTimestampToSeconds, convertMillisecondsToHMMSS, convertSecondsToHMMSS };
