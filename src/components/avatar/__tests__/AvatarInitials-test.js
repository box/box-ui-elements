import React from 'react';

import AvatarInitials from '../AvatarInitials';

describe('components/avatar/AvatarInitials', () => {
    test('should render the initials', () => {
        const wrapper = shallow(<AvatarInitials name="hello world" />);
        expect(wrapper.text()).toEqual('HW');
    });
    test('should render a span container', () => {
        const wrapper = shallow(<AvatarInitials name="hello world" />);
        expect(wrapper.is('span.avatar-initials')).toBeTruthy();
    });

    test('should accept className prop', () => {
        const wrapper = shallow(<AvatarInitials className="test" name="hello world" />);
        expect(wrapper.is('.test')).toBeTruthy();
        expect(wrapper.is('.test.avatar-initials')).toBeTruthy();
    });
});
