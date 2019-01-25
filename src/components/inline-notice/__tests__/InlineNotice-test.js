import React from 'react';

import InlineNotice from '..';

describe('components/inline-notice/InlineNotice', () => {
    test('should correctly render', () => {
        const children = 'this is a message to put in the notice';

        const wrapper = shallow(<InlineNotice>{children}</InlineNotice>);

        expect(wrapper.hasClass('inline-alert')).toBe(true);
        expect(wrapper.hasClass('inline-alert-visible')).toBe(true);
        expect(wrapper.text()).toEqual(children);
    });

    test('should have a default type', () => {
        const children = 'this is a message to put in the notice';

        const wrapper = shallow(<InlineNotice>{children}</InlineNotice>);

        expect(wrapper.hasClass('inline-alert-warning')).toBe(true);
    });

    test('should set the correct class based on type', () => {
        const children = 'this is a message to put in the notice';

        const wrapper = shallow(<InlineNotice type="error">{children}</InlineNotice>);

        expect(wrapper.hasClass('inline-alert-error')).toBe(true);
    });

    test('should have the given class', () => {
        const children = 'this is a message to put in the notice';

        const wrapper = shallow(<InlineNotice className="testClass">{children}</InlineNotice>);

        expect(wrapper.hasClass('testClass')).toBe(true);
    });
});
