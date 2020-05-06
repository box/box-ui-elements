import React from 'react';
import { shallow } from 'enzyme';
import IconStorage from '../IconStorage';

describe('icons/general/IconStorage', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconStorage />);

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.prop('height')).toEqual(12);
        expect(wrapper.prop('width')).toEqual(16);
        expect(wrapper.find('path').prop('fill')).toEqual('#26c281');
    });

    test('should correctly render icon with specified class', () => {
        const wrapper = shallow(<IconStorage className="test" />);

        expect(wrapper.hasClass('bdl-IconStorage')).toBe(true);
        expect(wrapper.hasClass('test')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = 'green';
        const wrapper = shallow(<IconStorage color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconStorage height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'hello';
        const wrapper = shallow(<IconStorage title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
