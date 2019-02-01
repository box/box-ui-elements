import React from 'react';

import AvatarInitials from '../AvatarInitials';

describe('components/avatar/AvatarInitials', () => {
    test('should render a span container', () => {
        const wrapper = shallow(<AvatarInitials className="test" name="hello world" />);
        expect(wrapper.is('span.avatar-initials.test')).toBeTruthy();
    });

    test('should render the initials', () => {
        const wrapper = shallow(<AvatarInitials name="hello world" />);
        expect(wrapper.text()).toEqual('hw');
    });

    test('should set a backgroundColor based on id', () => {
        const wrapper = shallow(<AvatarInitials id="10" name="hello world" />);
        expect(wrapper.prop('style').backgroundColor).toEqual('#0D67C7');
    });

    test('should set a default backgroundColor if no id is passed in', () => {
        const wrapper = shallow(<AvatarInitials name="hello world" />);
        expect(wrapper.prop('style').backgroundColor).toEqual('#18BBF7');
    });
});
