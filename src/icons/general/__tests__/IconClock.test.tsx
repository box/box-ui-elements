import React from 'react';
import { shallow } from 'enzyme';

import IconClock from '../IconClock';

describe('icons/general/IconClock', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconClock />);

        expect(wrapper.hasClass('bdl-IconClock')).toEqual(true);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconClock color={color} />);

        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('fill'),
        ).toEqual(color);
        expect(
            wrapper
                .find('path')
                .at(1)
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconClock height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconClock title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
