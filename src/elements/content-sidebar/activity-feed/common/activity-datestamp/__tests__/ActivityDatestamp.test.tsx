import { shallow } from 'enzyme';
import * as React from 'react';
import ActivityDatestamp, { MILLISECONDS_PER_YEAR } from '../ActivityDatestamp';

describe('elements/content-sidebar/activity-feed/common/activity-datestamp/ActivityDatestamp', () => {
    const MOCK_DATE = new Date('2021-01-01');
    const MOCK_DATE_STRING = '2021-01-01T00:00:00+00:00';
    const MOCK_DATE_TIME = 1609459200000;

    const getWrapper = (props = {}) => shallow(<ActivityDatestamp date={MOCK_DATE} {...props} />);

    test.each([MOCK_DATE, MOCK_DATE_STRING, MOCK_DATE_TIME])('should handle date passed in as %s', date => {
        const wrapper = getWrapper({ date });
        expect(wrapper.find('ReadableTime').prop('timestamp')).toBe(MOCK_DATE_TIME);
    });

    test('should not show time if date occurs outside of the last 12 months', () => {
        const wrapper = getWrapper({ date: new Date().getTime() - MILLISECONDS_PER_YEAR });
        expect(wrapper.find('ReadableTime').prop('alwaysShowTime')).toBe(false);
    });

    test('should show time if date occurs within the last 12 months', () => {
        const wrapper = getWrapper({ date: new Date().getTime() });
        expect(wrapper.find('ReadableTime').prop('alwaysShowTime')).toBe(true);
    });

    test('should pass on ReadableTime overrides', () => {
        const wrapper = getWrapper({ date: MOCK_DATE, uppercase: true });
        expect(wrapper.find('ReadableTime').prop('uppercase')).toBe(true);
    });
});
