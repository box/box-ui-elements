import React from 'react';
import { shallow } from 'enzyme';

import IconSharedLink from '../IconSharedLink';

describe('icons/general/IconSharedLink', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconSharedLink />);

        expect(wrapper.hasClass('icon-shared-link')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconSharedLink color={color} />);

        expect(wrapper.find('g').prop('stroke')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconSharedLink height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconSharedLink title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
