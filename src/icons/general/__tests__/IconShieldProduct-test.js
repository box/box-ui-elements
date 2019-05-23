// @flow
import React from 'react';

import IconShieldProduct from '../IconShieldProduct';

describe('icons/states/IconShieldProduct', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconShieldProduct />);
        expect(wrapper.hasClass('bdl-IconShieldProduct')).toBeTruthy();
    });

    test('should correctly render the icon with specified class', () => {
        const className = 'my-state';
        const wrapper = shallow(<IconShieldProduct className={className} />);

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 20;
        const height = 15;
        const wrapper = shallow(<IconShieldProduct height={height} width={width} />);

        expect(wrapper.prop('width')).toEqual(width);
        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render svg with specified title', () => {
        const title = 'oh what ever';
        const wrapper = shallow(<IconShieldProduct title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });

    test('should override color in svg when specified', () => {
        const color = '#bdf';
        const wrapper = shallow(<IconShieldProduct color={color} />);

        expect(wrapper).toMatchSnapshot();
    });
});
