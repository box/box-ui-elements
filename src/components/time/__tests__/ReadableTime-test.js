import React from 'react';
import sinon from 'sinon';

import { ReadableTime } from '..';

const sandbox = sinon.sandbox.create();

describe('components/time/ReadableTime', () => {
    const TEST_TIMESTAMP = 1506551456000; // Some random timestamp [09/27/2017 @ 10:33pm (UTC)]

    beforeEach(() => {
        const clock = sandbox.useFakeTimers();
        clock.tick(TEST_TIMESTAMP);
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const oneHourInMs = 60 * 60 * 1000;
    const oneDayInMs = 24 * oneHourInMs;
    // In order to leverage withData and not have flakey tests, we need to set a consistent test timestamp
    const today = new Date(TEST_TIMESTAMP);
    const now = today.getTime();
    const msYesterday = now - oneDayInMs;
    const msTwoDaysAgo = now - 2 * oneDayInMs;
    const msBeginningOfCenturyTime = new Date(2000, 0, 0).getTime();
    const ms1HourInFuture = now + oneHourInMs;

    [
        // {
        //     timestamp: now,
        //     hasFormattedRelativeComp: true,
        //     hasFormattedMessageComp: false,
        //     expectedValue: now,
        // },
        // {
        //     timestamp: ms10SecsAgo,
        //     hasFormattedRelativeComp: true,
        //     hasFormattedMessageComp: false,
        //     expectedValue: ms10SecsAgo,
        // },
        // {
        //     timestamp: ms10MinsAgo,
        //     hasFormattedRelativeComp: true,
        //     hasFormattedMessageComp: false,
        //     expectedValue: ms10MinsAgo,
        // },
        {
            timestamp: msYesterday,
            hasFormattedRelativeComp: false,
            hasFormattedMessageComp: true,
            expectedValue: 'Yesterday at {time, time, short}',
        },
        {
            timestamp: msBeginningOfCenturyTime,
            hasFormattedRelativeComp: false,
            hasFormattedMessageComp: true,
            expectedValue: '{time, date, medium}',
        },
    ].forEach(({ timestamp, hasFormattedRelativeComp, hasFormattedMessageComp, expectedValue }) => {
        test('should correctly render comment posted time when component is rendered with different times', () => {
            const wrapper = shallow(<ReadableTime relativeThreshold={oneHourInMs} timestamp={timestamp} />);

            expect(wrapper.find('FormattedRelative').length === 1).toEqual(hasFormattedRelativeComp);
            expect(wrapper.find('FormattedMessage').length === 1).toEqual(hasFormattedMessageComp);

            if (hasFormattedRelativeComp) {
                expect(wrapper.find('FormattedRelative').prop('value')).toEqual(expectedValue);
            } else {
                expect(wrapper.find('FormattedMessage').prop('defaultMessage')).toEqual(expectedValue);
            }
        });
    });
    [
        {
            description: 'Correctly renders timestamp that is yesterday',
            timestamp: msYesterday,
        },
        {
            description: 'Correctly renders timestamp that is the distant past',
            timestamp: msBeginningOfCenturyTime,
        },
        {
            description: 'Correctly renders timestamp that is a few days ago in the same year',
            timestamp: msTwoDaysAgo,
        },
        {
            description: 'Correctly renders timestamp that is a few days ago in the same year with the time',
            timestamp: msTwoDaysAgo,
            alwaysShowTime: true,
        },
        {
            description: 'Correctly renders timestamp that is 1 hour in the future with future timestamps enabled',
            timestamp: ms1HourInFuture,
        },
        {
            description: 'Correctly renders timestamp that is 1 hour in the future with future timestamps disabled',
            timestamp: ms1HourInFuture,
            allowFutureTimestamps: false,
        },
    ].forEach(({ description, timestamp, allowFutureTimestamps = true, alwaysShowTime = false }) => {
        test(description, () => {
            const wrapper = shallow(
                <ReadableTime
                    allowFutureTimestamps={allowFutureTimestamps}
                    alwaysShowTime={alwaysShowTime}
                    relativeThreshold={oneHourInMs}
                    timestamp={timestamp}
                />,
            );

            expect(wrapper).toMatchSnapshot();
        });
    });
});
