import React from 'react';
import { shallow } from 'enzyme';

import IconSharedLinkRestricted from '../IconSharedLinkRestricted';

describe('icons/general/IconSharedLinkRestricted', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconSharedLinkRestricted />);

        expect(wrapper.hasClass('icon-shared-link-restricted')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconSharedLinkRestricted color={color} />);

        expect(
            wrapper
                .find('g')
                .at(0)
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconSharedLinkRestricted height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconSharedLinkRestricted title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
