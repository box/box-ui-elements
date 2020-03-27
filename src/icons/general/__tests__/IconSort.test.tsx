import React from 'react';
import { shallow } from 'enzyme';

import IconSort from '../IconSort';

describe('icons/general/IconSort', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconSort />);

        expect(wrapper.hasClass('icon-sort')).toEqual(true);
        expect(wrapper.find('path').prop('fill')).toEqual('#222222');
        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(17);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(13);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconSort color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconSort height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconSort title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
