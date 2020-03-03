import React from 'react';
import { shallow } from 'enzyme';

import IconHelp from '../IconHelp';

describe('icons/general/IconHelp', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconHelp className="test-class" />);

        expect(wrapper.hasClass('icon-help')).toEqual(true);
        expect(wrapper.hasClass('test-class')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#123456';
        const wrapper = shallow(<IconHelp color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconHelp width={width} height={height} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconHelp title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
