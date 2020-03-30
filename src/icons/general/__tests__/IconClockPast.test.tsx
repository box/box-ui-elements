import React from 'react';
import { shallow } from 'enzyme';

import IconClockPast from '../IconClockPast';

describe('icons/general/IconClockPast', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconClockPast />);

        expect(wrapper.hasClass('icon-clock-past')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconClockPast color={color} />);

        const rectWrapper = wrapper.find('rect');
        const pathWrapper = wrapper.find('path');
        expect(rectWrapper.at(0).prop('fill')).toEqual(color);
        expect(rectWrapper.at(1).prop('fill')).toEqual(color);
        expect(pathWrapper.at(0).prop('stroke')).toEqual(color);
        expect(pathWrapper.at(1).prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 13;
        const height = 17;
        const wrapper = shallow(<IconClockPast height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconClockPast title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
