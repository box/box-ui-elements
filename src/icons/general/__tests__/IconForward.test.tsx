import React from 'react';
import { shallow } from 'enzyme';
import IconForward from '../IconForward';

describe('icons/general/IconForward', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconForward />);

        expect(wrapper.hasClass('icon-forward')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconForward color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconForward height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconForward title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
