import React from 'react';
import { shallow } from 'enzyme';

import IconRename from '../IconRename';

describe('icons/general/IconRename', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconRename />);

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.prop('height')).toEqual(13);
        expect(wrapper.prop('width')).toEqual(14);
        expect(wrapper.find('.fill-color').prop('fill')).toEqual('#444');
    });

    test('should correctly render icon with specified class', () => {
        const wrapper = shallow(<IconRename className="test" />);

        expect(wrapper.hasClass('icon-rename')).toBe(true);
        expect(wrapper.hasClass('test')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconRename color={color} />);

        expect(wrapper.find('.fill-color').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconRename height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconRename title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
