import React from 'react';
import { shallow } from 'enzyme';
import MetadataEmptyState from '../MetadataEmptyState';

describe('icons/states/MetadataEmptyState', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<MetadataEmptyState />);
        expect(wrapper.hasClass('metadata-empty-state')).toBeTruthy();
    });

    test('should correctly render the icon with specified class', () => {
        const className = 'my-state';
        const wrapper = shallow(<MetadataEmptyState className={className} />);

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 140;
        const height = 150;
        const wrapper = shallow(<MetadataEmptyState height={height} width={width} />);

        expect(wrapper.prop('width')).toEqual(width);
        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render svg with specified title', () => {
        const title = 'oh hi there';
        const wrapper = shallow(<MetadataEmptyState title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });
});
