import React from 'react';
import { shallow } from 'enzyme';

import IconUpdated from '../IconUpdated';

describe('icons/general/IconUpdated', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconUpdated />);

        expect(wrapper.hasClass('icon-updated')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconUpdated color={color} />);

        expect(wrapper.find('circle').prop('stroke')).toEqual(color);
        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconUpdated height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconUpdated title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
