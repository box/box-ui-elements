/**
 * @flow
 * @file Function to get date in simple format
 * @author Box
 */

/**
 * Gets the date in simple format
 *
 * @param {Object} date object
 * @param {string|void} [todayString] today
 * @param {string|void} [yesterdayString] yesterday
 * @return {string} date in words
 */
export function getDate(date: string, todayString?: string, yesterdayString?: string): string {
    const today: Date = new Date();
    const yesterday: Date = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const then: Date = new Date(date);
    const isToday: boolean = today.toDateString() === then.toDateString();
    const isYesterday: boolean = yesterday.toDateString() === then.toDateString();

    if (isToday && !!todayString) {
        return todayString;
    } else if (isYesterday && !!yesterdayString) {
        return yesterdayString;
    }
    return then.toDateString();
}

/**
 * Gets the date time in simple format
 *
 * @param {Object} date object
 * @param {string|void} [todayString] today
 * @param {string|void} [yesterdayString] yesterday
 * @return {string} date in words
 */
export function getDateTime(date: string, todayString?: string, yesterdayString?: string): string {
    const dateString: string = getDate(date, todayString, yesterdayString);
    const d: Date = new Date(date);
    return `${dateString}, ${d.toLocaleTimeString()}`;
}
