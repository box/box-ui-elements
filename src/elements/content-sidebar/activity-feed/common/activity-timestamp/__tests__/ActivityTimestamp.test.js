import * as React from 'react';
import { shallow } from 'enzyme';
import ActivityTimestamp from '../ActivityTimestamp';

describe('elements/content-sidebar/ActivityFeed/common/ActivityTimestamp', () => {
    test('should correctly render timestamp from previous years', () => {
        const TIME_STRING_SEPT_27_2017 = '2017-09-27T10:40:41-07:00';
        const unixTime = new Date(TIME_STRING_SEPT_27_2017).getTime();

        const wrapper = shallow(<ActivityTimestamp date={unixTime} />);

        // validating that the Tooltip and the time format are properly set
        expect(wrapper.find('ActivityDatestamp').prop('date')).toEqual(unixTime);

        expect(wrapper).toMatchSnapshot();
    });
});
