import React from 'react';

import Section from '..';

describe('components/section/Section', () => {
    test('should correctly render children in Section', () => {
        const children = <div>yea</div>;
        const wrapper = shallow(<Section title="ok">{children}</Section>);

        expect(wrapper.hasClass('section')).toBe(true);
        expect(wrapper.find('.section-content').contains(children)).toBe(true);
    });

    test('should correctly render title in Section', () => {
        const children = <div>yea</div>;
        const wrapper = shallow(<Section title="yeah buddy">{children}</Section>);

        expect(wrapper.find('.section-title').contains('yeah buddy')).toBe(true);
    });

    test('should correctly render description in Section', () => {
        const children = <div>yea</div>;
        const wrapper = shallow(
            <Section description="get it" title="yeah buddy">
                {children}
            </Section>,
        );

        expect(wrapper.find('.section-description').contains('get it')).toBe(true);
    });
});
