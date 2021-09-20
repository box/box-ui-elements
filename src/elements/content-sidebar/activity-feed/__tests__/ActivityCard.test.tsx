import { shallow } from 'enzyme';
import * as React from 'react';
import ActivityCard from '../ActivityCard';

describe('elements/content-sidebar/activity-feed/ActivityCard', () => {
    test('should render children and HTML div props', () => {
        const wrapper = shallow(
            <ActivityCard className="foo" data-prop="bar">
                <span>Child Span</span>
            </ActivityCard>,
        );

        expect(wrapper.hasClass('bcs-ActivityCard')).toBe(true);
        expect(wrapper.hasClass('foo')).toBe(true);
        expect(wrapper.prop('data-prop')).toEqual('bar');
        expect(wrapper.find('span').text()).toEqual('Child Span');
    });
});
