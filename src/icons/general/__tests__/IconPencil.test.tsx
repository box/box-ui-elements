import React from 'react';
import { shallow } from 'enzyme';

import IconPencil from '../IconPencil';

describe('icons/general/IconPencil', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconPencil />);

        expect(wrapper.hasClass('icon-pencil')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconPencil color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 17;
        const height = 17;
        const wrapper = shallow(<IconPencil height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconPencil title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
