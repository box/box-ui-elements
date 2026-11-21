import * as React from 'react';
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

    test('should compile its className with isHoverable if isHoverable is true and hasNewThreadedReplies is true', () => {
        const wrapper = getWrapper({ isHoverable: true, hasNewThreadedReplies: true });

        expect(wrapper.hasClass('bcs-is-hoverable')).toBe(true);
    });

    test.each`
        hasNewThreadedReplies | isHoverable
        ${false}              | ${false}
        ${true}               | ${false}
        ${false}              | ${true}
    `(
        `should not compile its className with isHoverable if isHoverable is $isHoverable and hasNewThreadedReplies is $hasNewThreadedReplies`,
        ({ hasNewThreadedReplies, isHoverable }) => {
            const wrapper = getWrapper({ isHoverable, hasNewThreadedReplies });

            expect(wrapper.hasClass('bcs-is-hoverable')).toBe(false);
        },
    );
});
