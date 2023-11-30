import * as React from 'react';

import ReadableTime from './ReadableTime';
import notes from './ReadableTime.stories.md';

const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * 24;
const MILLISECONDS_PER_WEEK = MILLISECONDS_PER_DAY * 7;

export const relativeTimestamps = () => (
    <div>
        <div>
            <ReadableTime
                relativeThreshold={MILLISECONDS_PER_HOUR}
                timestamp={Date.now() - MILLISECONDS_PER_HOUR + 30 * 60 * 1000}
            />
        </div>
        <div>
            <ReadableTime
                relativeThreshold={MILLISECONDS_PER_HOUR}
                timestamp={Date.now() - 2 * MILLISECONDS_PER_HOUR}
            />
        </div>
        <div>
            <ReadableTime relativeThreshold={MILLISECONDS_PER_HOUR} timestamp={Date.now() - MILLISECONDS_PER_DAY} />
        </div>
    </div>
);

export const dateWithoutTime = () => (
    <ReadableTime relativeThreshold={MILLISECONDS_PER_HOUR} timestamp={Date.now() - MILLISECONDS_PER_WEEK} />
);

export const dateWithTime = () => (
    <ReadableTime
        alwaysShowTime
        relativeThreshold={MILLISECONDS_PER_HOUR}
        timestamp={Date.now() - MILLISECONDS_PER_WEEK}
    />
);

export const dateInTheFutureWhenNotAllowed = () => (
    <ReadableTime
        allowFutureTimestamps={false}
        relativeThreshold={MILLISECONDS_PER_HOUR}
        timestamp={Date.now() + 70 * MILLISECONDS_PER_DAY}
    />
);

export default {
    title: 'Components|ReadableTime',
    component: ReadableTime,
    parameters: {
        notes,
    },
};
