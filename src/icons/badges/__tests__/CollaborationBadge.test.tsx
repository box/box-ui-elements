import React from 'react';
import { shallow } from 'enzyme';

import { bdlBoxBlue } from '../../../styles/variables';
import CollaborationBadge from '../CollaborationBadge';

describe('icons/badges/CollaborationBadge', () => {
    const getWrapper = (props = {}) => shallow(<CollaborationBadge {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.hasClass('collaboration-badge')).toBe(true);
        expect(wrapper.prop('height')).toEqual(16);
        expect(wrapper.prop('width')).toEqual(16);
        const paths = wrapper.find('path');
        expect(paths.at(0).prop('fill')).toEqual(bdlBoxBlue);
        expect(paths.at(1).prop('fill')).toEqual(bdlBoxBlue);
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
        const color = '#979EA2';
        const wrapper = getWrapper({ color });

        const fillColors = wrapper.find('.fill-color');
        for (let i = 0; i < fillColors.length; i += 1) {
            expect(fillColors.at(i).prop('fill')).toEqual(color);
        }
    });
});
