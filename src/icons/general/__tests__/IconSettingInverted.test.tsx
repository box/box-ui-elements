import React from 'react';
import { shallow } from 'enzyme';

import IconSettingInverted from '../IconSettingInverted';

describe('icons/general/IconSettingInverted', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconSettingInverted />);

        expect(wrapper.hasClass('icon-setting-inverted')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconSettingInverted color={color} />);

        expect(wrapper.find('g').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconSettingInverted height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconSettingInverted title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
