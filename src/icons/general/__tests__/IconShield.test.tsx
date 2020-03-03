// @flow
import React from 'react';
import { shallow } from 'enzyme';

import IconShield from '../IconShield';

describe('icons/states/IconShield', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconShield />);
        expect(wrapper.hasClass('bdl-IconShield')).toBeTruthy();
    });

    test('should correctly render the icon with specified class', () => {
        const className = 'my-state';
        const wrapper = shallow(<IconShield className={className} />);

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 20;
        const height = 15;
        const wrapper = shallow(<IconShield height={height} width={width} />);

        expect(wrapper.prop('width')).toEqual(width);
        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render svg with specified title', () => {
        const title = 'oh what ever';
        const wrapper = shallow(<IconShield title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });

    test('should override color in svg when specified', () => {
        const color = '#bdf';
        const wrapper = shallow(<IconShield color={color} />);

        expect(wrapper).toMatchSnapshot();
    });
});
