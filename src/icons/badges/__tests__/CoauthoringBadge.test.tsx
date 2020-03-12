import React from 'react';
import { shallow } from 'enzyme';

import CoauthoringBadge from '../CoauthoringBadge';

describe('icons/badges/CoauthoringBadge', () => {
    const getWrapper = (props = {}) => shallow(<CoauthoringBadge {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.hasClass('coauthoring-badge')).toBe(true);
        expect(wrapper.prop('height')).toEqual(16);
        expect(wrapper.prop('width')).toEqual(16);
    });

    test('should correctly render icon with specified class', () => {
        const className = 'test';
        const wrapper = getWrapper({ className });

        expect(wrapper.hasClass(className)).toBe(true);
    });

    test('should correctly render icon with specified height', () => {
        const height = 17;
        const wrapper = getWrapper({ height });

        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render icon with specified width', () => {
        const width = 17;
        const wrapper = getWrapper({ width });

        expect(wrapper.prop('width')).toEqual(width);
    });

    test('should correctly render icon with specified title', () => {
        const title = 'fool';
        const wrapper = getWrapper({ title });

        expect(wrapper.prop('title')).toEqual(title);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#123';
        const wrapper = getWrapper({ color });

        expect(wrapper).toMatchSnapshot();
    });
});
