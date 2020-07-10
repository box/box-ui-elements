import * as React from 'react';
import { shallow } from 'enzyme';

import ActivityFeedEmptyStateIllustration from '../ActivityFeedEmptyStateIllustration';

describe('elements/content-sidebar/ActivityFeed/illustrations/IconActivityFeedEmptyState', () => {
    test('should correctly add class if passed', () => {
        const wrapper = shallow(<ActivityFeedEmptyStateIllustration className="test" />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<ActivityFeedEmptyStateIllustration height={height} width={width} />);

        expect(wrapper).toMatchSnapshot();
    });
});
