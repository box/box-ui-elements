import React from 'react';
import { shallow } from 'enzyme';

import AvatarInitials from '../AvatarInitials';

describe('components/avatar/AvatarInitials', () => {
    test('should render a span container', () => {
        const wrapper = shallow(<AvatarInitials className="test" name="hello world" />);
        expect(wrapper.is('span.avatar-initials.test')).toBeTruthy();
    });

    test.each`
        name                               | initials
        ${'hello'}                         | ${'HH'}
        ${'hello world'}                   | ${'HW'}
        ${'hello world (personal)'}        | ${'HW'}
        ${'hello world {personal acct}'}   | ${'HW'}
        ${'hello world <personal acct>'}   | ${'HW'}
        ${'hello world [personal acct]'}   | ${'HW'}
        ${'hello world  (personal acct)'}  | ${'HW'}
        ${' hello world (personal acct)'}  | ${'HW'}
        ${'hello  world  (personal acct)'} | ${'HW'}
        ${'hello world {{personal acct}}'} | ${'HW'}
        ${'hello world <{personal acct}>'} | ${'HW'}
        ${'hello world ((personal acct))'} | ${'HW'}
        ${'John S. Smith'}                 | ${'JS'}
        ${'James R. Stein-Grennaway'}      | ${'JS'}
    `('should render the initials "$initials" from name "$name"', ({ name, initials }) => {
        const wrapper = shallow(<AvatarInitials name={name} />);
        expect(wrapper.text()).toEqual(initials);
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
