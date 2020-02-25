import React from 'react';
import { shallow } from 'enzyme';

import IconUpload from '../IconUpload';

describe('icons/general/IconUpload', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconUpload />);

        expect(wrapper.hasClass('icon-upload')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconUpload color={color} />);

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
        const wrapper = shallow(<IconUpload height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconUpload title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
