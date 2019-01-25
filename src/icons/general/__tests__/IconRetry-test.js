import React from 'react';

import IconRetry from '../IconRetry';

describe('icons/general/IconRetry', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconRetry />);

        expect(wrapper.hasClass('icon-retry')).toEqual(true);
        expect(wrapper.find('path').prop('fill')).toEqual('#ED3757');
        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(14);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(16);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconRetry color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconRetry width={width} height={height} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconRetry title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
