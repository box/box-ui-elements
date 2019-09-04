import React from 'react';

import AvatarInitials from '../AvatarInitials';

describe('components/avatar/AvatarInitials', () => {
    test('should render a span container', () => {
        const wrapper = shallow(<AvatarInitials className="test" name="hello world" />);
        expect(wrapper.is('span.avatar-initials-0.test')).toBeTruthy();
    });

    test('should render the initials', () => {
        const wrapper = shallow(<AvatarInitials name="hello world" />);
        expect(wrapper.text()).toEqual('HW');
    });

    test('should set className based on id', () => {
        const wrapper = shallow(<AvatarInitials id="10" name="hello world" />);
        expect(wrapper.hasClass('avatar-initials-1')).toEqual(true);
    });

    test('should set a default className if no id is passed in', () => {
        const wrapper = shallow(<AvatarInitials name="hello world" />);
        expect(wrapper.hasClass('avatar-initials-0')).toEqual(true);
    });
});
