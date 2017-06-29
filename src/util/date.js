/**
 * @flow
 * @file Function to get date in simple format
 * @author Box
 */

/**
 * Gets the date in simple format
 *
 * @param {Object} date object
 * @param {string} todayString today
 * @param {string} yesterdayString yesterday
 * @return {string} date in words
 */
export default function(date: string, todayString: string, yesterdayString: string): string {
    const today: Date = new Date();
    const yesterday: Date = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const then: Date = new Date(date);
    const isToday: boolean = today.toDateString() === then.toDateString();
    const isYesterday: boolean = yesterday.toDateString() === then.toDateString();

    if (isToday) {
        return todayString;
    } else if (isYesterday) {
        return yesterdayString;
    }
    return then.toDateString();
}
