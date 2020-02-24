import React from 'react';
import { shallow } from 'enzyme';

import IconBell from '../IconBell';

describe('icons/general/IconBell', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconBell />);

        expect(wrapper.hasClass('icon-bell')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconBell color={color} />);

        expect(
            wrapper
                .find('circle')
                .at(0)
                .prop('stroke'),
        ).toEqual(color);
        expect(
            wrapper
                .find('circle')
                .at(1)
                .prop('stroke'),
        ).toEqual(color);
        expect(wrapper.find('path').prop('stroke')).toEqual(color);
        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconBell height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconBell title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
