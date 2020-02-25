import React from 'react';
import { shallow } from 'enzyme';

import IconLink from '../IconLink';

describe('icons/general/IconLink', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconLink />);

        expect(wrapper.hasClass('icon-link')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconLink color={color} />);

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
        const wrapper = shallow(<IconLink height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconLink title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
