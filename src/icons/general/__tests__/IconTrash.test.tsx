import React from 'react';
import { shallow } from 'enzyme';

import IconTrash from '../IconTrash';

describe('icons/general/IconTrash', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconTrash />);

        expect(wrapper.hasClass('icon-trash')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconTrash color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 17;
        const height = 17;
        const wrapper = shallow(<IconTrash height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconTrash title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
