import React from 'react';
import { shallow } from 'enzyme';
import IconMetadataColumns from '../IconMetadataColumns';

describe('icons/metadata-view/IconMetadataColumns', () => {
    const getWrapper = (props = {}) => shallow(<IconMetadataColumns {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.hasClass('metadata-columns')).toBe(true);
        expect(wrapper.prop('height')).toEqual(16);
        expect(wrapper.prop('width')).toEqual(16);
    });

    test('should correctly render icon with specified class', () => {
        const className = 'test';
        const wrapper = getWrapper({ className });

        expect(wrapper.hasClass(className)).toBe(true);
    });
});
