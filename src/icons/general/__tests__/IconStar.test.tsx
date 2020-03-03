import React from 'react';
import { shallow } from 'enzyme';

import IconStar from '../IconStar';

describe('icons/general/IconStar', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconStar />);

        expect(wrapper.hasClass('icon-star')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconStar color={color} />);

        expect(wrapper.find('path').prop('stroke')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconStar height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconStar title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
