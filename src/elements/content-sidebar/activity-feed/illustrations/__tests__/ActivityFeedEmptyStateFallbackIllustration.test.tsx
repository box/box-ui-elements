import * as React from 'react';
import { shallow } from 'enzyme';
import AccessibleSVG from '../../../../../icons/accessible-svg';

import ActivityFeedEmptyStateFallbackIllustration from '../ActivityFeedEmptyStateFallbackIllustration';

describe('elements/content-sidebar/activity-feed/illustrations/ActivityFeedEmptyStateFallbackIllustration', () => {
    test('should correctly add class if passed', () => {
        const wrapper = shallow(<ActivityFeedEmptyStateFallbackIllustration className="test" />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<ActivityFeedEmptyStateFallbackIllustration height={height} width={width} />);

        const svg = wrapper.find(AccessibleSVG);
        expect(svg.prop('height')).toBe(height);
        expect(svg.prop('width')).toBe(width);
    });
});
