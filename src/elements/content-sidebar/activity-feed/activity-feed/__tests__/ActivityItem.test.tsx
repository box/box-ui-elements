import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import ActivityItem from '../ActivityItem';

describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityItem', () => {
    const getWrapper = (props = {}): ShallowWrapper => shallow(<ActivityItem {...props}>Test</ActivityItem>);

    test('should compile its default class and its className prop value', () => {
        const className = 'bcs-Test';
        const wrapper = getWrapper({ className });

        expect(wrapper.hasClass('bcs-ActivityItem')).toBe(true);
        expect(wrapper.hasClass(className)).toBe(true);
    });

    test.each([true, false])('should compile its className with isFocused equal to %s', isFocused => {
        expect(getWrapper({ isFocused }).hasClass('bcs-is-focused')).toBe(isFocused);
    });
});
