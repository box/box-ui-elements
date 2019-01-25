/**
 * @flow
 * @file Date and time utilities
 * @author Box
 */

const MILLISECONDS_PER_SECOND = 1000;
// 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * MILLISECONDS_PER_SECOND;
// 60 sec * 1000
const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;

/**
 * Converts an integer value in seconds to milliseconds.
 * @param {number} seconds - The value in seconds
 * @returns {number} the value in milliseconds
 */
function convertToMs(seconds: number): number {
    return seconds * MILLISECONDS_PER_SECOND;
}

/**
 * Checks whether the given date value (in unix milliseconds) is today.
 * @param {number|Date} dateValue - Date object or integer representing the number of milliseconds since 1/1/1970 UTC
 * @returns {boolean} whether the given value is today
 */
function isToday(dateValue: number | Date): boolean {
    const currentDate = new Date();
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return currentDate.toDateString() === date.toDateString();
}

/**
 * Checks whether the given date value (in unix milliseconds) is yesterday.
 * @param {number} dateValue - Date object or integer or representing the number of milliseconds since 1/1/1970 UTC
 * @returns {boolean} wether the given value is yesterday
 */
function isYesterday(dateValue: number | Date): boolean {
    const date = dateValue instanceof Date ? dateValue.getTime() : dateValue;
    return isToday(date + MILLISECONDS_PER_DAY);
}

/**
 * Checks whether the given date value (in unix milliseconds) is tomorrow.
 * @param {number} dateValue - Date object or integer or representing the number of milliseconds since 1/1/1970 UTC
 * @returns {boolean} whether the given value is tomorrow
 */
function isTomorrow(dateValue: number | Date): boolean {
    const date = dateValue instanceof Date ? dateValue.getTime() : dateValue;
    return isToday(date - MILLISECONDS_PER_DAY);
}

/**
 * Checks whether the given date value (in unix milliseconds) is in the current year.
 * @param {number|Date} dateValue - Date object or integer representing the number of milliseconds since 1/1/1970 UTC
 * @returns {boolean} whether the given value is in the current year
 */
function isCurrentYear(dateValue: number | Date): boolean {
    const currentDate = new Date();
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return currentDate.getFullYear() === date.getFullYear();
}

/**
 * Formats a number of seconds as a time string
 *
 * @param {number} seconds - seconds
 * @return {string} a string formatted like 3:57:35
 */
function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);
    const hour = h > 0 ? `${h.toString()}:` : '';
    const sec = s < 10 ? `0${s.toString()}` : s.toString();
    let min = m.toString();
    if (h > 0 && m < 10) {
        min = `0${min}`;
    }
    return `${hour}${min}:${sec}`;
}

/**
 * Adds time to a given dateValue
 *
 * @param {number|Date} dateValue - date or integer value to add time to
 * @param {number} timeToAdd - amount of time to add in ms
 * @return {number|Date} the modified date or integer
 */
function addTime(dateValue: number | Date, timeToAdd: number): number | Date {
    if (dateValue instanceof Date) {
        return new Date(dateValue.getTime() + timeToAdd);
    }

    return dateValue + timeToAdd;
}

/**
 * Will convert
 *      2018-06-13T07:00:00.000Z
 * to
 *      2018-06-13T00:00:00.000Z
 *
 * This is the opposite of convertISOStringToUTCDate
 *
 * @param {Date} date
 * @return {number}
 */
function convertDateToUnixMidnightTime(date: Date) {
    // date is localized to 00:00:00 at system/browser timezone
    const utcUnixTimeInMs = date.getTime();

    // timezone an integer offset; minutes behind GMT
    // we use the browser timezone offset instead of the user's,
    // because the datepicker uses the browser to get the "midnight"
    // time in the user's timezone with getTime()
    const timezoneOffsetInMins = date.getTimezoneOffset();
    const timezoneOffsetInMs = timezoneOffsetInMins * MILLISECONDS_PER_MINUTE;

    // we need the unix/epoch time for midnight on the date selected
    const unixDayMidnightTime = utcUnixTimeInMs - timezoneOffsetInMs;
    return unixDayMidnightTime;
}

/**
 * Will convert
 *      2018-06-13T00:00:00.000Z
 * to
 *      2018-06-13T07:00:00.000Z
 *
 * This is the opposite of convertDateToUnixMidnightTime
 *
 * @param {string} isoString - ISO string in UTC time zone
 */
function convertISOStringToUTCDate(isoString: string): Date {
    // get date in UTC midnight time
    const utcDate = new Date(isoString);
    const utcTime = utcDate.getTime();

    // get browser's timezone
    const timezoneOffsetInMins = utcDate.getTimezoneOffset();
    const timezoneOffsetInMs = timezoneOffsetInMins * MILLISECONDS_PER_MINUTE;

    // return date in utc timezone
    const localizedUnixTimeInMs = utcTime + timezoneOffsetInMs;
    return new Date(localizedUnixTimeInMs);
}

export {
    convertToMs,
    convertDateToUnixMidnightTime,
    convertISOStringToUTCDate,
    isToday,
    isTomorrow,
    isYesterday,
    isCurrentYear,
    formatTime,
    addTime,
};
