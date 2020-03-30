// @flow

import { injectIntl } from 'react-intl';

import { ONE_HOUR_MS } from '../../constants';
import { isToday, isYesterday, isCurrentYear } from '../../utils/datetime';

import messages from './messages';

type Props = {
    /** A boolean that will cause future timestamps (usually due to incorrect computer time) to be corrected to the isToday message */
    allowFutureTimestamps?: boolean,
    /** A boolean that will include the time alongside the date, if the date is shown */
    alwaysShowTime?: boolean,
    /** intl object */
    intl: any,
    /** The number of milliseconds before now that a relative (vs. absolute) time should be displayed (Default: 1 hour) */
    relativeThreshold?: number,
    /** A boolean that will include the weekday alongside the date, if the date is shown */
    showWeekday?: boolean,
    /** The timestamp which should be used to display the date */
    timestamp: number,
    /** Whether to generate and make locale aware an uppercase version of the string */
    uppercase?: boolean,
};

// exclude languages that do not have a grammar for uppercase (e.g. russian)
const nonUppercaseLocales = ['ru'];
const ReadableTime = ({
    intl,
    timestamp,
    relativeThreshold = ONE_HOUR_MS,
    allowFutureTimestamps = true,
    alwaysShowTime = false,
    showWeekday = false,
    uppercase = false,
}: Props): string => {
    const shouldUppercase = uppercase && !nonUppercaseLocales.includes(intl.locale);
    const relativeIfNewerThanTs = Date.now() - relativeThreshold;
    const shouldShowYear = !isCurrentYear(timestamp);

    if (!allowFutureTimestamps && timestamp > Date.now()) {
        // TODO: what is the reasoning behind this rule?
        timestamp = relativeIfNewerThanTs; // Default to 'Today' for timestamps that would show a future date
    }

    // e.g. Oct 5, 2018
    let dateMessage = messages.eventTime;
    let date = null;
    let weekday = null;
    let output;
    if (isToday(timestamp)) {
        // e.g. Today at 12:30 PM
        dateMessage = messages.eventTimeToday;
    } else if (isYesterday(timestamp)) {
        // e.g. Yesterday at 11:30 AM
        dateMessage = messages.eventTimeYesterday;
    } else if (showWeekday) {
        // e.g. Monday, Oct 5, 2018
        dateMessage = messages.eventTimeWeekdayLong;
        weekday = intl.formatDate(timestamp, { weekday: 'long' });
    } else if (shouldShowYear && alwaysShowTime) {
        // e.g. Oct 5, 2018 at 10:30 PM
        dateMessage = messages.eventTimeDate;
    } else if (!shouldShowYear && alwaysShowTime) {
        // e.g. Oct 5 at 10:30 PM
        dateMessage = messages.eventTimeDateShort;
        date = intl.formatDate(timestamp, { month: 'short', day: 'numeric' });
    } else if (!shouldShowYear && !alwaysShowTime) {
        // e.g. Oct 5
        output = intl.formatDate(timestamp, { month: 'short', day: 'numeric' });
        return shouldUppercase ? output.toLocaleUpperCase(intl.locale) : output;
    }
    const values = { time: timestamp, date, weekday };
    output = intl.formatMessage(dateMessage, values);

    // if the time stamp is within +/- the relative threshold for the current time,
    // print the default time format
    const timeDiff = timestamp - Date.now();
    if (Math.abs(timeDiff) <= relativeThreshold) {
        if (intl.formatRelativeTime) {
            // react-intl v3
            output = intl.formatRelativeTime(timeDiff);
        } else {
            // react-intl v2
            output = intl.formatRelative(timestamp);
        }
    }

    return shouldUppercase ? output.toLocaleUpperCase(intl.locale) : output;
};

export { ReadableTime as ReadableTimeComponent };
export default injectIntl(ReadableTime);
