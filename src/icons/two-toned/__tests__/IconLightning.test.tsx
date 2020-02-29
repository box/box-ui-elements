import React from 'react';
import { shallow } from 'enzyme';
import IconLightning from '../IconLightning';

describe('icons/two-toned/IconLightning', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconLightning />);
        expect(wrapper.hasClass('bdl-IconLightning')).toBe(true);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconLightning height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'test';
        const wrapper = shallow(<IconLightning title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
