import React from 'react';
import { shallow } from 'enzyme';

import IconHamburger from '../IconHamburger';

describe('icons/general/IconHamburger', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconHamburger className="test-class" />);

        expect(wrapper.hasClass('icon-hamburger')).toEqual(true);
        expect(wrapper.hasClass('test-class')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconHamburger color={color} />);

        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconHamburger height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconHamburger title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
