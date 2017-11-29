/**
 * @flow
 * @file Simple data and time utilities
 * @author Box
 */

/**
 * Checks whether the given date is today.
 *
 * @param {Date} dateValue - date to check
 * @return {boolean}
 */
function isToday(dateValue: Date) {
    const currentDate = new Date();
    const date = new Date(dateValue);
    return currentDate.toDateString() === date.toDateString();
}

/**
 * Checks whether the given date is yesterday.
 *
 * @param {Date} dateValue - date to check
 * @return {boolean}
 */
function isYesterday(dateValue: Date) {
    const yesterday: Date = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString() === dateValue.toDateString();
}

/**
 * Formats a number of seconds as a time string
 *
 * @param {number} seconds - seconds
 * @return {string} A string formatted like 3:57:35
 */
function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 3600 % 60);
    const hour = h > 0 ? `${h.toString()}:` : '';
    const sec = s < 10 ? `0${s.toString()}` : s.toString();
    let min = m.toString();
    if (h > 0 && m < 10) {
        min = `0${min}`;
    }
    return `${hour}${min}:${sec}`;
}

export { isToday, isYesterday, formatTime };
