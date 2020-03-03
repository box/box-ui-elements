import React from 'react';
import { shallow } from 'enzyme';

import IconFeed from '../IconFeed';

describe('icons/general/IconFeed', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconFeed />);

        expect(wrapper.hasClass('icon-feed')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconFeed color={color} />);

        expect(wrapper.find('path').prop('stroke')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconFeed height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'hungry';
        const wrapper = shallow(<IconFeed title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
