// @flow
import React from 'react';
import { FormattedMessage, FormattedRelative, FormattedDate } from 'react-intl';

import { ONE_HOUR_MS } from '../../constants';
import { isToday, isYesterday, isCurrentYear } from '../../utils/datetime';

import messages from './messages';

type Props = {
    /** A boolean that will cause future timestamps (usually due to incorrect computer time) to be corrected to the isToday message */
    allowFutureTimestamps?: boolean,
    /** A boolean that will include the time alongside the date, if the date is shown */
    alwaysShowTime?: boolean,
    /** The number of milliseconds before now that a relative (vs. absolute) time should be displayed (Default: 1 hour) */
    relativeThreshold?: number,
    /** A boolean that will include the weekday alongside the date, if the date is shown */
    showWeekday?: boolean,
    /** The timestamp which should be used to display the date */
    timestamp: number,
};

const ReadableTime = ({
    timestamp,
    relativeThreshold = ONE_HOUR_MS,
    allowFutureTimestamps = true,
    alwaysShowTime = false,
    showWeekday = false,
}: Props) => {
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
    if (isToday(timestamp)) {
        // e.g. Today at 12:30 PM
        dateMessage = messages.eventTimeToday;
    } else if (isYesterday(timestamp)) {
        // e.g. Yesterday at 11:30 AM
        dateMessage = messages.eventTimeYesterday;
    } else if (showWeekday) {
        // e.g. Monday, Oct 5, 2018
        dateMessage = messages.eventTimeWeekdayLong;
        weekday = <FormattedDate value={timestamp} weekday="long" />;
    } else if (shouldShowYear && alwaysShowTime) {
        // e.g. Oct 5, 2018 at 10:30 PM
        dateMessage = messages.eventTimeDate;
    } else if (!shouldShowYear && alwaysShowTime) {
        // e.g. Oct 5 at 10:30 PM
        dateMessage = messages.eventTimeDateShort;
        date = <FormattedDate value={timestamp} month="short" day="numeric" />;
    } else if (!shouldShowYear && !alwaysShowTime) {
        // e.g. Oct 5
        return <FormattedDate value={timestamp} month="short" day="numeric" />;
    }

    let output = <FormattedMessage {...dateMessage} values={{ time: timestamp, date, weekday }} />;

    // if the time stamp is within +/- the relative threshold for the current time,
    // print the default time format
    if (Math.abs(Date.now() - timestamp) <= relativeThreshold) {
        output = <FormattedRelative value={timestamp} />;
    }

    return output;
};

export default ReadableTime;
