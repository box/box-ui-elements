import React from 'react';

import Logo from '..';
import { BOX_BLUE } from 'common/variables';

describe('components/logo/Logo', () => {
    test('should correctly render default Logo', () => {
        const wrapper = shallow(<Logo />);

        expect(wrapper.hasClass('logo')).toBe(true);
        expect(wrapper.find('IconLogo').prop('width')).toEqual(45);
        expect(wrapper.find('IconLogo').prop('height')).toEqual(25);
        expect(wrapper.find('IconLogo').prop('color')).toEqual(BOX_BLUE);
    });

    test('should correctly render Logo specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<Logo color={color} />);

        expect(wrapper.find('IconLogo').prop('color')).toEqual(color);
    });

    test('should correctly render Logo specified width and height', () => {
        const width = 55;
        const height = 445;
        const wrapper = shallow(<Logo width={width} height={height} />);

        expect(wrapper.find('IconLogo').prop('width')).toEqual(width);
        expect(wrapper.find('IconLogo').prop('height')).toEqual(height);
    });

    test('should correctly render Logo specified title', () => {
        const title = 'Hello there';
        const wrapper = shallow(<Logo title={title} />);

        expect(wrapper.find('IconLogo').prop('title')).toEqual(title);
    });
});
