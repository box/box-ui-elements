import React from 'react';
import { shallow } from 'enzyme';

import IconAlignLeft from '../IconAlignLeft';

describe('icons/general/IconAlignLeft', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconAlignLeft />);

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.prop('height')).toEqual(10);
        expect(wrapper.prop('width')).toEqual(13);
        expect(wrapper.find('.stroke-color').prop('stroke')).toEqual('#444');
    });

    test('should correctly render icon with specified class', () => {
        const wrapper = shallow(<IconAlignLeft className="test" />);

        expect(wrapper.hasClass('icon-align-left')).toBe(true);
        expect(wrapper.hasClass('test')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconAlignLeft color={color} />);

        expect(wrapper.find('.stroke-color').prop('stroke')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconAlignLeft height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconAlignLeft title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
