import React from 'react';
import { shallow } from 'enzyme';

import IconCalendar from '../IconCalendar';

describe('icons/general/IconCalendar', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconCalendar />);

        expect(wrapper.hasClass('icon-calendar')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconCalendar color={color} />);

        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 32;
        const height = 34;
        const wrapper = shallow(<IconCalendar height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconCalendar title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
