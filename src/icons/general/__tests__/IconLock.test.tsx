import React from 'react';
import { shallow } from 'enzyme';

import IconLock from '../IconLock';

describe('icons/general/IconLock', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconLock />);

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.prop('height')).toEqual(14);
        expect(wrapper.prop('width')).toEqual(13);
        const fillColors = wrapper.find('.fill-color');
        for (let i = 0; i < fillColors.length; i += 1) {
            expect(fillColors.at(i).prop('fill')).toEqual('#444');
        }
    });

    test('should correctly render icon with specified class', () => {
        const wrapper = shallow(<IconLock className="test" />);

        expect(wrapper.hasClass('icon-lock')).toBe(true);
        expect(wrapper.hasClass('test')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconLock color={color} />);

        const fillColors = wrapper.find('.fill-color');
        for (let i = 0; i < fillColors.length; i += 1) {
            expect(fillColors.at(i).prop('fill')).toEqual(color);
        }
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconLock height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with specified opacity', () => {
        const opacity = 0.5;
        const wrapper = shallow(<IconLock opacity={opacity} />);

        expect(wrapper.find('AccessibleSVG').prop('opacity')).toEqual(opacity);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconLock title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
