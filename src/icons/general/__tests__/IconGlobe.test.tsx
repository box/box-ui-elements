import React from 'react';
import { shallow } from 'enzyme';

import { white } from '../../../styles/variables';

import IconGlobe from '../IconGlobe';

describe('icons/general/IconGlobe', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconGlobe />);

        expect(wrapper.hasClass('icon-globe')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = white;
        const wrapper = shallow(<IconGlobe color={color} />);

        expect(
            wrapper
                .find('path')
                .at(1)
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconGlobe height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconGlobe title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
