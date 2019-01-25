import React from 'react';

import IconGlobe from '../IconGlobe';

describe('icons/general/IconGlobe', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconGlobe />);

        expect(wrapper.hasClass('icon-globe')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconGlobe color={color} />);

        expect(
            wrapper
                .find('circle')
                .at(0)
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconGlobe width={width} height={height} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconGlobe title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
