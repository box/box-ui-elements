import React from 'react';
import { shallow } from 'enzyme';
import AccessibleSVG from '../AccessibleSVG';

describe('icons/accessible-svg/AccessibleSVG', () => {
    describe('render()', () => {
        test('should correctly svg with correct props and aria labels', () => {
            const wrapper = shallow(
                <AccessibleSVG
                    aria-labelledby="blagh"
                    className="whatup"
                    height={24}
                    role="img"
                    viewBox="0 0 24 24"
                    width={24}
                >
                    <path d="M0 1h10l-.7 1H0z" />
                </AccessibleSVG>,
            );

            expect(wrapper.hasClass('whatup')).toBe(true);
            expect(wrapper.prop('width')).toEqual(24);
            expect(wrapper.prop('height')).toEqual(24);
            expect(wrapper.prop('viewBox')).toEqual('0 0 24 24');
            expect(wrapper.prop('role')).toEqual('presentation');
            expect(wrapper.prop('aria-labelledby')).toBeUndefined();
            expect(wrapper.prop('focusable')).toEqual('false');
        });

        test('should render svg with aria label, role="img", and title element when title is provided', () => {
            const wrapper = shallow(
                <AccessibleSVG title="foo">
                    <path d="M0 1h10l-.7 1H0z" />
                </AccessibleSVG>,
            );

            const title = wrapper.find('title');
            expect(title.length).toBe(1);
            expect(wrapper.prop('role')).toEqual('img');

            const titleID = title.prop('id');
            expect(wrapper.prop('aria-labelledby')).toEqual(titleID);
        });

        test('should render an svg with role="presentation" but no aria-label or title element when no title is provided', () => {
            const wrapper = shallow(
                <AccessibleSVG>
                    <path d="M0 1h10l-.7 1H0z" />
                </AccessibleSVG>,
            );

            const title = wrapper.find('title');
            expect(title.length).toBe(0);
            expect(wrapper.prop('role')).toEqual('presentation');
            expect(wrapper.prop('aria-labelledby')).not.toBeDefined();
        });
    });
});
