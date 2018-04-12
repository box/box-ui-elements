import React from 'react';
import { shallow } from 'enzyme';

import IconActivityFeedEmptyState from '../IconActivityFeedEmptyState';

describe('components/ContentSidebar/ActivityFeed/icons/IconActivityFeedEmptyState', () => {
    test('should correctly add class if passed', () => {
        const wrapper = shallow(<IconActivityFeedEmptyState className='test' />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconActivityFeedEmptyState width={width} height={height} />);

        expect(wrapper).toMatchSnapshot();
    });
});
