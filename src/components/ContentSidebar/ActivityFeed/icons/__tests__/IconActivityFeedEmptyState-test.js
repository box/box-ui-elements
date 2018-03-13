import React from 'react';
import { shallow } from 'enzyme';

import IconActivityFeedEmptyState from '../IconActivityFeedEmptyState';

describe('features/activity-feed/icons/IconActivityFeedEmptyState', () => {
    test('should correctly add class if passed', () => {
        const wrapper = shallow(<IconActivityFeedEmptyState className='test' />);

        expect(wrapper.hasClass('box-ui-activity-feed-empty-state-illustration')).toEqual(true);
        expect(wrapper.hasClass('test')).toEqual(true);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconActivityFeedEmptyState width={width} height={height} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });
});
