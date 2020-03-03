import React from 'react';
import { shallow } from 'enzyme';

import IconComposeNote from '../IconComposeNote';

describe('icons/general/IconComposeNote', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconComposeNote />);

        expect(wrapper.hasClass('icon-compose-note')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconComposeNote color={color} />);

        const paths = wrapper.find('path');
        for (let i = 0; i < paths.length; i += 1) {
            expect(paths.at(i).prop('fill')).toEqual(color);
        }
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconComposeNote height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconComposeNote title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
