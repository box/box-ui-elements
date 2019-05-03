import React from 'react';

import IconGlobe2 from '../IconGlobe2';

describe('icons/general/IconGlobe2', () => {
    const getWrapper = (props = {}) => shallow(<IconGlobe2 {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();

        expect(wrapper.hasClass('icon-zones')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = getWrapper({ color });

        expect(
            wrapper
                .find('path')
                .first()
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = getWrapper({ height, width });

        const svgComponent = wrapper.find('AccessibleSVG');

        expect(svgComponent.prop('width')).toEqual(width);
        expect(svgComponent.prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = getWrapper({ title });

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
