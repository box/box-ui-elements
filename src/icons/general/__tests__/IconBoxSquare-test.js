import React from 'react';

import IconBoxSquare from '../IconBoxSquare';

describe('icons/general/IconBoxSquare', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconBoxSquare />);

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.prop('height')).toEqual(72);
        expect(wrapper.prop('height')).toEqual(72);
        expect(wrapper.hasClass('box-square-icon')).toEqual(true);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 50;
        const height = 50;
        const wrapper = shallow(<IconBoxSquare height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'hellojello';
        const wrapper = shallow(<IconBoxSquare title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
