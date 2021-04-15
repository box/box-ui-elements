import React from 'react';
import { shallow } from 'enzyme';

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

    test(`should render a badge with info styling when initialized`, () => {
        const wrapper = shallow(<Badge type="info">test</Badge>);

        expect(wrapper).toMatchSnapshot();
    });

    test(`should render a badge with warning styling when initialized`, () => {
        const wrapper = shallow(<Badge type="warning">test</Badge>);

        expect(wrapper).toMatchSnapshot();
    });

    test(`should render a badge with highlight styling when initialized`, () => {
        const wrapper = shallow(<Badge type="highlight">test</Badge>);

        expect(wrapper).toMatchSnapshot();
    });
});
