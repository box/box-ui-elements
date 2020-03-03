import React from 'react';
import { shallow } from 'enzyme';

import IconInfoThin from '../IconInfoThin';

describe('icons/general/IconInfoThin', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconInfoThin />);

        expect(wrapper.hasClass('icon-info-thin')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconInfoThin color={color} />);

        expect(
            wrapper
                .find('circle')
                .at(0)
                .prop('stroke'),
        ).toEqual(color);
        expect(
            wrapper
                .find('circle')
                .at(1)
                .prop('fill'),
        ).toEqual(color);
        expect(wrapper.find('rect').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconInfoThin height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconInfoThin title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
