import React from 'react';

import AvatarInitials from '../AvatarInitials';

describe('components/avatar/AvatarInitials', () => {
    test('should render a span container', () => {
        const wrapper = shallow(<AvatarInitials className="test" name="hello world" />);
        expect(wrapper.is('span.avatar-initials.test')).toBeTruthy();
    });

    test('should render the initials', () => {
        const wrapper = shallow(<AvatarInitials name="hello world" />);
        expect(wrapper.text()).toEqual('HW');
    });

    test('should set data-bg-idx attribute based on id', () => {
        const wrapper = shallow(<AvatarInitials id="10" name="hello world" />);
        expect(wrapper.prop('data-bg-idx')).toEqual(1);
    });

    test('should set a default data-bg-idx attribute if no id is passed in', () => {
        const wrapper = shallow(<AvatarInitials name="hello world" />);
        expect(wrapper.prop('data-bg-idx')).toEqual(0);
    });
});
