import React from 'react';
import { shallow } from 'enzyme';
import IconExclamationMark from '../IconExclamationMark';

describe('icons/two-toned/IconExclamationMark', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconExclamationMark />);
        expect(wrapper.hasClass('icon-exclamation-mark-2')).toBe(true);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconExclamationMark height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'test';
        const wrapper = shallow(<IconExclamationMark title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
