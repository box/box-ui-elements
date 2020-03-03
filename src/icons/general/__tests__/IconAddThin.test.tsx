import React from 'react';
import { shallow } from 'enzyme';

import IconAddThin from '../IconAddThin';

describe('icons/general/IconAddThin', () => {
    test('should correctly render default icon, color, width and height', () => {
        const wrapper = shallow(<IconAddThin />);

        expect(wrapper.hasClass('icon-add-thin')).toEqual(true);
        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(17);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(17);
        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('fill'),
        ).toEqual('#222222');
        expect(
            wrapper
                .find('path')
                .at(1)
                .prop('fill'),
        ).toEqual('#222222');
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconAddThin color={color} />);

        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('fill'),
        ).toEqual(color);
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
        const wrapper = shallow(<IconAddThin height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconAddThin title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
