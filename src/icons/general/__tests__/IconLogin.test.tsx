import React from 'react';
import { shallow } from 'enzyme';
import IconLogin from '../IconLogin';

describe('icons/general/IconLogin', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconLogin />);

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.prop('height')).toEqual(16);
        expect(wrapper.prop('width')).toEqual(16);
        expect(wrapper.find('path').prop('fill')).toEqual('#4e4e4e');
    });

    test('should correctly render icon with specified class', () => {
        const wrapper = shallow(<IconLogin className="test" />);

        expect(wrapper.hasClass('bdl-IconLogin')).toBe(true);
        expect(wrapper.hasClass('test')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = 'green';
        const wrapper = shallow(<IconLogin color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconLogin height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'hello';
        const wrapper = shallow(<IconLogin title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
