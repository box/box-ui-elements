import React from 'react';
import { shallow } from 'enzyme';
import FolderEmptyState from '../FolderEmptyState';

describe('icons/states/FolderEmptyState', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<FolderEmptyState />);
        expect(wrapper.hasClass('folder-empty-state')).toBeTruthy();
    });

    test('should correctly render the icon with specified class', () => {
        const className = 'my-state';
        const wrapper = shallow(<FolderEmptyState className={className} />);

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 17;
        const height = 21;
        const wrapper = shallow(<FolderEmptyState height={height} width={width} />);

        expect(wrapper.prop('width')).toEqual(width);
        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render svg with specified title', () => {
        const title = 'oh hi there';
        const wrapper = shallow(<FolderEmptyState title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });
});
