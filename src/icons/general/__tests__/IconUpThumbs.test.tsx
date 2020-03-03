import React from 'react';
import { shallow } from 'enzyme';

import IconThumbsUp from '../IconThumbsUp';

describe('icons/general/IconThumbsUp', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconThumbsUp />);

        expect(wrapper.hasClass('icon-thumbs-up')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconThumbsUp color={color} />);

        expect(wrapper.find('g').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 99;
        const height = 101;
        const wrapper = shallow(<IconThumbsUp height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'boop';
        const wrapper = shallow(<IconThumbsUp title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
