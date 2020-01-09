import * as React from 'react';
import { shallow } from 'enzyme';

import IconActivityFeedEmptyState from '../IconActivityFeedEmptyState';

describe('elements/content-sidebar/ActivityFeed/icons/IconActivityFeedEmptyState', () => {
    test('should correctly add class if passed', () => {
        const wrapper = shallow(<IconActivityFeedEmptyState className="test" />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconActivityFeedEmptyState height={height} width={width} />);

        expect(wrapper).toMatchSnapshot();
    });
});
