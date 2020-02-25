import React from 'react';
import { shallow } from 'enzyme';

import IconInfoInverted from '../IconInfoInverted';

describe('icons/general/IconInfoInverted', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconInfoInverted />);

        expect(wrapper.hasClass('icon-info-inverted')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconInfoInverted color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconInfoInverted height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconInfoInverted title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
