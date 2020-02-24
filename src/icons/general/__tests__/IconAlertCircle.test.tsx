import React from 'react';
import { shallow } from 'enzyme';

import IconAlertCircle from '../IconAlertCircle';

describe('icons/general/IconAlertCircle', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconAlertCircle />);

        expect(wrapper.hasClass('icon-alert-circle')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconAlertCircle color={color} />);

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
        const wrapper = shallow(<IconAlertCircle height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconAlertCircle title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
