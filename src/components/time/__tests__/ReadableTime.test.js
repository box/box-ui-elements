import React from 'react';
import sinon from 'sinon';
import 'full-icu';
import { createIntl } from 'react-intl';
import russianMessages from '../../../../i18n/ru-RU.js';
import japaneseMessages from '../../../../i18n/ja-JP.js';

import { ReadableTimeComponent as ReadableTime } from '../ReadableTime';

jest.unmock('react-intl');
const sandbox = sinon.sandbox.create();
const intl = createIntl({ locale: 'en' });

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

    test.each`
        timestamp                        | timestampName                      | allowFutureTimestamps | alwaysShowTime | showWeekday | description
        ${msYesterday}                   | ${'yesterday'}                     | ${true}               | ${false}       | ${false}    | ${'Yesterday at hh:mm'}
        ${msBeginningOfCenturyTime}      | ${'msBeginningOfCenturyTime'}      | ${true}               | ${false}       | ${false}    | ${'mm dd yy at hh:mm'}
        ${msTwoDaysAgo}                  | ${'msTwoDaysAgo'}                  | ${true}               | ${false}       | ${false}    | ${'mm dd'}
        ${msTwoDaysAgo}                  | ${'msTwoDaysAgo'}                  | ${true}               | ${true}        | ${false}    | ${'mm dd at hh:mm when we show the time'}
        ${msTwoDaysAgo}                  | ${'msTwoDaysAgo'}                  | ${true}               | ${false}       | ${true}     | ${'Weekday'}
        ${relativeThreshold * 2 + now}   | ${'relativeThreshold * 2 + now'}   | ${true}               | ${false}       | ${false}    | ${'Today at hh:mm'}
        ${ms1HourInFuture}               | ${'ms1HourInFuture'}               | ${false}              | ${false}       | ${false}    | ${'Today at hh:mm'}
        ${withinRelativeThresholdAhead}  | ${'withinRelativeThresholdAhead'}  | ${true}               | ${false}       | ${false}    | ${'in 30 minutes'}
        ${withinRelativeThresholdBehind} | ${'withinRelativeThresholdBehind'} | ${true}               | ${false}       | ${false}    | ${'30 minutes ago'}
    `(
        'timestamp: $timestampName | allowFutureTimestamps: $allowFutureTimestamps | alwaysShowTime: $alwaysShowTime | showWeekday: $showWeekday | $description',
        ({ timestamp, allowFutureTimestamps = true, alwaysShowTime = false, showWeekday = false }) => {
            const wrapper = mount(
                <ReadableTime
                    intl={intl}
                    allowFutureTimestamps={allowFutureTimestamps}
                    alwaysShowTime={alwaysShowTime}
                    relativeThreshold={oneHourInMs}
                    showWeekday={showWeekday}
                    timestamp={timestamp}
                />,
            );

            expect(wrapper.children()).toMatchSnapshot();
            wrapper.setProps({ uppercase: true });
            expect(wrapper.children()).toMatchSnapshot('uppercase');
        },
    );

    test('should use default relative threshold if not provided', () => {
        const wrapper = shallow(<ReadableTime intl={intl} timestamp={withinRelativeThresholdAhead} />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should not uppercase locales that do not have uppercase grammar (e.g. russian)', () => {
        const ruIntl = createIntl({ locale: 'ru', messages: russianMessages });

        const wrapperUppercase = mount(
            <ReadableTime intl={ruIntl} timestamp={withinRelativeThresholdAhead} uppercase />,
        );
        const wrapperLowercase = mount(
            <ReadableTime intl={ruIntl} timestamp={withinRelativeThresholdAhead} uppercase={false} />,
        );

        expect(wrapperUppercase.text()).toEqual(wrapperLowercase.text());
    });
    test('CJK languages should look the same for uppercase and lowercase (e.g. japanese)', () => {
        const jaIntl = createIntl({ locale: 'ja', messages: japaneseMessages });

        const wrapperUppercaseJa = mount(
            <ReadableTime intl={jaIntl} timestamp={withinRelativeThresholdAhead} uppercase />,
        );
        const wrapperLowercaseJa = mount(
            <ReadableTime intl={jaIntl} timestamp={withinRelativeThresholdAhead} uppercase={false} />,
        );

        expect(wrapperUppercaseJa.text()).toEqual(wrapperLowercaseJa.text());
    });
});
