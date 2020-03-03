import React from 'react';
import { shallow } from 'enzyme';

import IconFlagSolid from '../IconFlagSolid';

describe('icons/general/IconFlagSolid', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconFlagSolid />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconFlagSolid color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 18;
        const height = 18;
        const wrapper = shallow(<IconFlagSolid height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconFlagSolid title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
