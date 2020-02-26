import React from 'react';
import { shallow } from 'enzyme';

import BookmarkIcon from '../BookmarkIcon';

describe('icons/bookmark-icon/BookmarkIcon', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<BookmarkIcon />);

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.hasClass('icon-bookmark')).toBe(true);
    });

    test('should correctly render icon with specified class', () => {
        const className = 'test';
        const wrapper = shallow(<BookmarkIcon className={className} />);

        expect(wrapper.hasClass('icon-bookmark')).toBe(true);
        expect(wrapper.hasClass(className)).toBe(true);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<BookmarkIcon height={height} width={width} />);

        expect(wrapper.prop('width')).toEqual(width);
        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'test';
        const wrapper = shallow(<BookmarkIcon title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });
});
