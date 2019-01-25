import React from 'react';

import ItemListLoadingPlaceholder from '../ItemListLoadingPlaceholder';

describe('features/content-explorer/item-list/ItemListLoadingPlaceholder', () => {
    const renderComponent = props => shallow(<ItemListLoadingPlaceholder {...props} />);

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = renderComponent();

            expect(wrapper.hasClass('item-list-loading-placeholder')).toBe(true);
        });

        test('should render component with width when specified', () => {
            const width = '500px';
            const wrapper = renderComponent({ width });

            expect(wrapper.find('.item-list-loading-placeholder').prop('style')).toEqual({ width });
        });
    });
});
