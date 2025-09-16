/**
 * @file Utility functions for timestamp formatting and conversion
 */

/**
 * Converts a timestamp representation to seconds
 * @param timestamp The timestamp in milliseconds
 * @returns The total seconds
 */
const convertTimestampToSeconds = (timestamp: number): number => {
    if (!timestamp || Number.isNaN(Number(timestamp))) {
        return 0;
    }
    const totalSeconds = timestamp / 1000;
    return totalSeconds;
};

/**
 * Converts milliseconds to HH:MM:SS format
 * @param timestampInMilliseconds The timestamp in milliseconds
 * @returns The formatted timestamp string in HH:MM:SS format
 */
const convertMillisecondsToHMMSS = (timestampInMilliseconds: number): string => {
    // detect if the timestamp is a number

    // convert to HMMSS based on locale
    if (!timestampInMilliseconds || timestampInMilliseconds < 0) {
        return '0:00:00';
    }
    const hours = Math.floor(timestampInMilliseconds / 3600000);
    const minutes = Math.floor((timestampInMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((timestampInMilliseconds % 60000) / 1000);
    // timestamp in the format 1:23:45
    return `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Converts seconds to HH:MM:SS format
 * @param seconds number of seconds
 * @returns The formatted timestamp string in HH:MM:SS format
 */
const convertSecondsToHMMSS = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsValue = seconds % 60;
    return `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${secondsValue.toString().padStart(2, '0')}`;
};

export { convertTimestampToSeconds, convertMillisecondsToHMMSS, convertSecondsToHMMSS };
