import React from 'react';
import { shallow } from 'enzyme';
import IconPowerPointDesktop from '../IconPowerPointDesktop';

describe('icons/microsoft-office/IconPowerPointDesktop', () => {
    const getWrapper = (props = {}) => shallow(<IconPowerPointDesktop {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.hasClass('icon-powerpoint-desktop')).toBe(true);
        expect(wrapper.prop('height')).toEqual(30);
        expect(wrapper.prop('width')).toEqual(30);
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

    test('should correctly render icon with specified title', () => {
        const title = 'fool';
        const wrapper = getWrapper({ title });

        expect(wrapper.prop('title')).toEqual(title);
    });

    test('should correctly render icon with specified width', () => {
        const width = 17;
        const wrapper = getWrapper({ width });

        expect(wrapper.prop('width')).toEqual(width);
    });
});
