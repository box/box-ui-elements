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

    const relativeThreshold = oneHourInMs;
    const withinRelativeThresholdAhead = now + relativeThreshold / 2;
    const withinRelativeThresholdBehind = now - relativeThreshold / 2;

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
        test('should render comment posted time when component is rendered with different times', () => {
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
            description: 'should render with format "Yesterday at hh:mm"',
            timestamp: msYesterday,
        },
        {
            description: 'should render with distant past format "mm dd yy at hh:mm"',
            timestamp: msBeginningOfCenturyTime,
        },
        {
            description: 'should render two days ago with format "mm dd"',
            timestamp: msTwoDaysAgo,
        },
        {
            description: 'should render two days ago with format "mm dd at hh:mm" when we show the time',
            timestamp: msTwoDaysAgo,
            alwaysShowTime: true,
        },
        {
            description: 'should render with weekday when we show weekday',
            timestamp: msTwoDaysAgo,
            showWeekday: true,
        },
        {
            description: 'should render with format "Today at hh:mm" when there is a future time stamp',
            timestamp: relativeThreshold * 2 + now,
        },
        {
            description: 'should render with format "Today at hh:mm" when `allowFutureTimestamps` is false',
            timestamp: ms1HourInFuture,
            allowFutureTimestamps: false,
        },
        {
            description:
                'should render with format "in 30 minutes" when timestamp is within relative threshold (ahead)',
            timestamp: withinRelativeThresholdAhead,
        },
        {
            description:
                'should render with format "30 minutes ago" when timestamp is within relative threshold (behind)',
            timestamp: withinRelativeThresholdBehind,
        },
    ].forEach(
        ({ description, timestamp, allowFutureTimestamps = true, alwaysShowTime = false, showWeekday = false }) => {
            test(description, () => {
                const wrapper = shallow(
                    <ReadableTime
                        allowFutureTimestamps={allowFutureTimestamps}
                        alwaysShowTime={alwaysShowTime}
                        relativeThreshold={oneHourInMs}
                        showWeekday={showWeekday}
                        timestamp={timestamp}
                    />,
                );

                expect(wrapper).toMatchSnapshot();
            });
        },
    );

    test('should use default relative threshold if not provided', () => {
        const wrapper = shallow(<ReadableTime timestamp={withinRelativeThresholdAhead} />);

        expect(wrapper.find('FormattedRelative')).toHaveLength(1);
    });
});
