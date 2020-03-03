import React from 'react';
import { shallow } from 'enzyme';

import IconPlay from '../IconPlay';

describe('icons/general/IconPlay', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconPlay />);

        expect(wrapper.hasClass('icon-play')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconPlay color={color} />);

        expect(
            wrapper
                .find('path')
                .first()
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconPlay height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconPlay title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
