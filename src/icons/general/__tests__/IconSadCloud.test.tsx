import React from 'react';
import { shallow } from 'enzyme';

import IconSadCloud from '../IconSadCloud';

describe('icons/general/IconSadCloud', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconSadCloud />);

        expect(wrapper.hasClass('icon-sad-cloud')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconSadCloud color={color} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconSadCloud height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconSadCloud title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
