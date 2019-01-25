import React from 'react';

import CountBadge from '../CountBadge';

describe('components/badgeable/Badgeable', () => {
    test('should correctly render with default props', () => {
        const wrapper = shallow(<CountBadge value={1} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render proper classes when animateable', () => {
        const wrapper = shallow(<CountBadge shouldAnimate />);

        expect(wrapper.hasClass('animate')).toBeTruthy();
    });

    test('should render proper classes when visible', () => {
        const wrapper = shallow(<CountBadge isVisible={false} />);

        expect(wrapper.hasClass('is-visible')).toBeFalsy();
    });

    test('should handle custom classes', () => {
        const wrapper = shallow(<CountBadge className="test" />);

        expect(wrapper.hasClass('test')).toBeTruthy();
    });
});
