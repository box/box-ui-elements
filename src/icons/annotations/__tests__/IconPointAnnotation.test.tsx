import React from 'react';
import { shallow } from 'enzyme';

import IconPointAnnotation from '../IconPointAnnotation';

describe('icons/annotations/IconPointAnnotation', () => {
    const render = (props = {}) => shallow(<IconPointAnnotation {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = render();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified class', () => {
        const className = 'foo';
        const wrapper = render({ className });

        expect(wrapper.hasClass(className)).toEqual(true);
        expect(wrapper.hasClass('icon-annotation-point')).toEqual(true);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = render({ width, height });

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = render({ title });

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });

    test('should correctly render icon with fill color', () => {
        const color = 'foo';
        const wrapper = render({ color });

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });
});
