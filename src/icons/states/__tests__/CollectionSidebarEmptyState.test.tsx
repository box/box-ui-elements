import React from 'react';
import { shallow } from 'enzyme';
import CollectionSidebarEmptyState from '../CollectionSidebarEmptyState';

describe('icons/states/CollectionSidebarEmptyState', () => {
    test('should correctly render state svg with default state class', () => {
        const wrapper = shallow(<CollectionSidebarEmptyState />);
        expect(wrapper.hasClass('collection-sidebar-empty-state')).toBe(true);
    });

    test('should correctly render state svg with specified class', () => {
        const className = 'my-state';
        const wrapper = shallow(<CollectionSidebarEmptyState className={className} />);

        expect(wrapper.hasClass(className)).toBe(true);
    });

    test('should correctly render state svg with specified color', () => {
        const color = '#123456';
        const wrapper = shallow(<CollectionSidebarEmptyState color={color} />);

        expect(
            wrapper
                .find('g')
                .at(1)
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render state svg with specified width and height', () => {
        const width = 17;
        const height = 21;
        const wrapper = shallow(<CollectionSidebarEmptyState height={height} width={width} />);

        expect(wrapper.prop('width')).toEqual(width);
        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render svg with specified title', () => {
        const title = 'oh hi there';
        const wrapper = shallow(<CollectionSidebarEmptyState title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });
});
