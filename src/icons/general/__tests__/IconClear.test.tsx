import React from 'react';
import { shallow } from 'enzyme';

import IconClear from '../IconClear';

describe('icons/general/IconClear', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconClear />);

        expect(wrapper.hasClass('icon-clear')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconClear color={color} />);

        expect(
            wrapper
                .find('g')
                .at(1)
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconClear height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconClear title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
