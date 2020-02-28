import React from 'react';
import { shallow } from 'enzyme';
import FavoritesEmptyState from '../FavoritesEmptyState';

describe('icons/states/FavoritesEmptyState', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<FavoritesEmptyState />);
        expect(wrapper.hasClass('favorites-empty-state')).toBeTruthy();
    });

    test('should correctly render the icon with specified class', () => {
        const className = 'my-state';
        const wrapper = shallow(<FavoritesEmptyState className={className} />);

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 17;
        const height = 21;
        const wrapper = shallow(<FavoritesEmptyState height={height} width={width} />);

        expect(wrapper.prop('width')).toEqual(width);
        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render svg with specified title', () => {
        const title = 'oh hi there';
        const wrapper = shallow(<FavoritesEmptyState title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });
});
