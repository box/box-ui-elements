import React from 'react';
import { shallow } from 'enzyme';

import { white } from '../../../styles/variables';

import IconGlobeTinycon from '../IconGlobeTinycon';

describe('icons/general/IconGlobeTinycon', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconGlobeTinycon />);

        expect(wrapper.hasClass('icon-globe')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = white;
        const wrapper = shallow(<IconGlobeTinycon color={color} />);

        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('stroke'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconGlobeTinycon height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconGlobeTinycon title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
