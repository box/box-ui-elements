import React from 'react';

import Badge from '../Badge';

describe('components/badge/Badge', () => {
    test('should correctly render children in badge', () => {
        const children = 'some child text';

        const wrapper = shallow(<Badge>{children}</Badge>);

        expect(wrapper.hasClass('badge')).toBe(true);
        expect(wrapper.text()).toEqual(children);
    });

    test('should accept and propagate className when className prop passed', () => {
        const wrapper = shallow(<Badge className="some-badge-style">test</Badge>);

        expect(wrapper.hasClass('some-badge-style')).toBe(true);
    });

    [
        {
            type: 'info',
        },
        {
            type: 'warning',
        },
        {
            type: 'highlight',
        },
    ].forEach(({ type }) => {
        test(`should render a badge with ${type} styling when initialized`, () => {
            const wrapper = shallow(<Badge type={type}>test</Badge>);

            expect(wrapper).toMatchSnapshot();
        });
    });
});
