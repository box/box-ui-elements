import React from 'react';
import { shallow } from 'enzyme';

import IconChat from '../IconChat';

describe('icons/general/IconChat', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconChat />);

        expect(wrapper.hasClass('icon-chat')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconChat color={color} />);

        expect(wrapper.find('g').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconChat height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconChat title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
