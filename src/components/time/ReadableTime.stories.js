import * as React from 'react';

import ReadableTime from './ReadableTime';
import notes from './ReadableTime.stories.md';

const msInADay = 24 * 60 * 60 * 1000;
const oneHourInMs = 60 * 60 * 1000;

export const relativeTimestamps = () => (
    <div>
        <div>
            <ReadableTime timestamp={Date.now() - oneHourInMs + 30 * 60 * 1000} relativeThreshold={oneHourInMs} />
        </div>
        <div>
            <ReadableTime timestamp={Date.now() - 2 * oneHourInMs} relativeThreshold={oneHourInMs} />
        </div>
        <div>
            <ReadableTime timestamp={Date.now() - msInADay} relativeThreshold={oneHourInMs} />
        </div>
    </div>
);

export const dateWithoutTime = () => (
    <ReadableTime timestamp={Date.now() - 7 * msInADay} relativeThreshold={oneHourInMs} />
);

export const dateWithTime = () => (
    <ReadableTime timestamp={Date.now() - 7 * msInADay} relativeThreshold={oneHourInMs} alwaysShowTime />
);

export const dateInTheFutureWhenNotAllowed = () => (
    <ReadableTime
        timestamp={Date.now() + 70 * msInADay}
        relativeThreshold={oneHourInMs}
        allowFutureTimestamps={false}
    />
);

export default {
    title: 'Components|ReadableTime',
    component: ReadableTime,
    parameters: {
        notes,
    },
};
