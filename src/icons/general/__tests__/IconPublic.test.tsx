import React from 'react';
import { shallow } from 'enzyme';

import IconPublic from '../IconPublic';

describe('icons/general/IconPublic', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconPublic />);

        expect(wrapper.hasClass('bdl-IconPublic')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconPublic color={color} />);

        expect(wrapper.find('path').prop('stroke')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconPublic height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconPublic title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
