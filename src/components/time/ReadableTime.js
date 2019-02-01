// @flow
import React from 'react';
import { FormattedMessage, FormattedRelative, FormattedDate } from 'react-intl';

import { isToday, isYesterday, isCurrentYear } from 'utils/datetime';

import messages from './messages';

type Props = {
    /** The timestamp which should be used to display the date */
    allowFutureTimestamps?: boolean,
    /** The number of milliseconds before now that a relative (vs. absolute) time should be displayed */
    alwaysShowTime?: boolean,
    /** A boolean that will cause future timestamps (usually due to incorrect computer time) to be corrected to the isToday message */
    relativeThreshold: number,
    /** A boolean that will include the time alongside the date, if the date is shown */
    timestamp: number,
};

const ReadableTime = ({
    timestamp,
    relativeThreshold,
    allowFutureTimestamps = true,
    alwaysShowTime = false,
}: Props) => {
    const relativeIfNewerThanTs = Date.now() - relativeThreshold;
    const shouldShowYear = !isCurrentYear(timestamp);

    if (!allowFutureTimestamps && timestamp > Date.now()) {
        timestamp = relativeIfNewerThanTs; // Default to 'Today' for timestamps that would show a future date
    }

    // e.g. Oct 5, 2018
    let dateMessage = messages.eventTime;
    let date = null;
    if (isToday(timestamp)) {
        // e.g. Today at 12:30 PM
        dateMessage = messages.eventTimeToday;
    } else if (isYesterday(timestamp)) {
        // e.g. Yesterday at 11:30 AM
        dateMessage = messages.eventTimeYesterday;
    } else if (shouldShowYear && alwaysShowTime) {
        // e.g. Oct 5, 2018 at 10:30 PM
        dateMessage = messages.eventTimeDate;
    } else if (!shouldShowYear && alwaysShowTime) {
        // e.g. Oct 5 at 10:30 PM
        dateMessage = messages.eventTimeDateShort;
        date = <FormattedDate day="numeric" month="short" value={timestamp} />;
    } else if (!shouldShowYear && !alwaysShowTime) {
        // e.g. Oct 5
        return <FormattedDate day="numeric" month="short" value={timestamp} />;
    }

    return timestamp > relativeIfNewerThanTs ? (
        <FormattedRelative value={timestamp} />
    ) : (
        <FormattedMessage {...dateMessage} values={{ time: timestamp, date }} />
    );
};

export default ReadableTime;
