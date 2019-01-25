import React from 'react';

import InlineError from '..';

describe('components/inline-error/InlineError', () => {
    test('should correctly render', () => {
        const children = 'this is a message to put in the notice';
        const title = 'title';

        const wrapper = shallow(<InlineError title={title}>{children}</InlineError>);

        expect(wrapper.hasClass('inline-alert')).toBe(true);
        expect(wrapper.hasClass('inline-alert-visible')).toBe(true);
        expect(wrapper.hasClass('inline-alert-error')).toBe(true);
        expect(wrapper.find('b').text()).toEqual(title);
        expect(
            wrapper
                .children()
                .find('div')
                .text(),
        ).toEqual(children);
    });
});
