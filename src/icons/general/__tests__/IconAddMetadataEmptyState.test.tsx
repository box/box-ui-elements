import React from 'react';
import { shallow } from 'enzyme';

import IconAddMetadataEmptyState from '../IconAddMetadataEmptyState';

describe('icons/general/IconAddMetadataEmptyState', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconAddMetadataEmptyState />);

        expect(wrapper.hasClass('icon-add-metadata-empty-state')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconAddMetadataEmptyState color={color} />);

        expect(
            wrapper
                .find('path')
                .first()
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const wrapper = shallow(<IconAddMetadataEmptyState width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconAddMetadataEmptyState title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
