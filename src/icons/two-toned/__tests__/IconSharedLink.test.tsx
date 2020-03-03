import React from 'react';
import { shallow } from 'enzyme';
import IconSharedLink from '../IconSharedLink';

describe('icons/two-toned/IconSharedLink', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconSharedLink />);
        expect(wrapper.hasClass('icon-shared-link-2')).toBe(true);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconSharedLink height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'test';
        const wrapper = shallow(<IconSharedLink title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
