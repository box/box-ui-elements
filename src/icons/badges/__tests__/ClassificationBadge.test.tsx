import React from 'react';
import { shallow } from 'enzyme';

import ClassificationBadge from '../ClassificationBadge';

describe('icons/badges/ClassificationBadge', () => {
    const getWrapper = (props = {}) => shallow(<ClassificationBadge {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.hasClass('bdl-ClassificationBadge')).toBe(true);
        expect(wrapper.prop('height')).toEqual(16);
        expect(wrapper.prop('width')).toEqual(16);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified class', () => {
        const className = 'test';
        const wrapper = getWrapper({ className });

        expect(wrapper.hasClass(className)).toBe(true);
    });

    test('should correctly render icon with specified height', () => {
        const height = 32;
        const wrapper = getWrapper({ height });

        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render icon with specified width', () => {
        const width = 32;
        const wrapper = getWrapper({ width });

        expect(wrapper.prop('width')).toEqual(width);
    });

    test('should correctly render icon with specified title', () => {
        const title = 'My Title';
        const wrapper = getWrapper({ title });

        expect(wrapper.prop('title')).toEqual(title);
    });
});
