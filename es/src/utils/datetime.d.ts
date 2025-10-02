/**
 * Helper to normalize a date value to a date object
 * @param dateValue - Date number, string, or object
 * @returns {Date} the normalized date object
 */
declare function convertToDate(dateValue: number | string | Date): Date;
/**
 * Converts an integer value in seconds to milliseconds.
 * @param {number} seconds - The value in seconds
 * @returns {number} the value in milliseconds
 */
declare function convertToMs(seconds: number): number;
/**
 * Checks whether the given date value (in unix milliseconds) is today.
 * @param dateValue - Date object or integer representing the number of milliseconds since 1/1/1970 UTC
 * @returns whether the given value is today
 */
declare function isToday(dateValue: number | string | Date): boolean;
/**
 * Checks whether the given date value (in unix milliseconds) is yesterday.
 * @param dateValue - Date object or integer or representing the number of milliseconds since 1/1/1970 UTC
 * @returns whether the given value is yesterday
 */
declare function isYesterday(dateValue: number | string | Date): boolean;
/**
 * Checks whether the given date value (in unix milliseconds) is tomorrow.
 * @param dateValue - Date object or integer or representing the number of milliseconds since 1/1/1970 UTC
 * @returns whether the given value is tomorrow
 */
declare function isTomorrow(dateValue: number | string | Date): boolean;
/**
 * Checks whether the given date value (in unix milliseconds) is in the current month.
 * @param dateValue - Date object or integer representing the number of milliseconds since 1/1/1970 UTC
 * @returns whether the given value is in the current month
 */
declare function isCurrentMonth(dateValue: number | string | Date): boolean;
/**
 * Checks whether the given date value (in unix milliseconds) is in the current year.
 * @param dateValue - Date object or integer representing the number of milliseconds since 1/1/1970 UTC
 * @returns whether the given value is in the current year
 */
declare function isCurrentYear(dateValue: number | string | Date): boolean;
/**
 * Formats a number of seconds as a time string
 *
 * @param seconds - seconds
 * @returns a string formatted like 3:57:35
 */
declare function formatTime(seconds: number): string;
/**
 * Adds time to a given dateValue
 *
 * @param {number|Date} dateValue - date or integer value to add time to
 * @param {number} timeToAdd - amount of time to add in ms
 * @returns {number|Date} the modified date or integer
 */
declare function addTime(dateValue: number | Date, timeToAdd: number): number | Date;
/**
 * Will convert
 *      2018-06-13T07:00:00.000Z
 * to
 *      2018-06-13T00:00:00.000Z
 *
 * That is, it will give you the unix time in ms for midnight of the given
 * date in UTC timezone. This is the opposite of convertISOStringToUTCDate
 *
 * @param {Date} date - the date to be converted to midnight
 * @returns {number} the unix time in ms for midnight of the given date
 */
declare function convertDateToUnixMidnightTime(date: Date): number;
/**
 * Will check to see if a date object is not valid, according to the browser
 * JS engine.
 *
 * @param {Date} date - the date to be validated
 * @returns {boolean} whether the date value passes validation
 */
declare function isValidDate(date: Date): boolean;
/**
 * Will convert ISO8601-compatible dates (with zone designators)
 *      2018-06-13T00:00:00.000-0500
 *      or
 *      2018-06-13T00:00:00.000-05
 *
 * to
 *      2018-06-13T00:00:00.000-05:00
 *
 * Equivalent formats between the two (e.g., uzing 'Z') will remain unchanged.
 * If the date format cannot be converted, it will pass along the existing value
 *
 * @param {string} isoString - the date to be converted
 * @returns {string} converted date format, if applicable
 */
declare function convertISOStringtoRFC3339String(isoString: string): string;
/**
 * Will convert
 *      2018-06-13T00:00:00.000Z
 * to
 *      2018-06-13T07:00:00.000Z
 *
 * This is the opposite of convertDateToUnixMidnightTime
 *
 * @param {string} isoString - ISO string in UTC time zone
 * @returns {Date} date in UTC time zone
 */
declare function convertISOStringToUTCDate(isoString: string): Date;
export { addTime, convertDateToUnixMidnightTime, convertISOStringtoRFC3339String, convertISOStringToUTCDate, convertToDate, convertToMs, formatTime, isCurrentMonth, isCurrentYear, isToday, isTomorrow, isValidDate, isYesterday, };
