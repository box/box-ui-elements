import React from 'react';

import ContentExplorerEmptyState from '../ContentExplorerEmptyState';

describe('features/content-explorer/content-explorer/ContentExplorerEmptyState', () => {
    const renderComponent = props => shallow(<ContentExplorerEmptyState {...props} />);

    describe('render()', () => {
        test('should render the default component', () => {
            const wrapper = renderComponent();

            expect(wrapper.find('.content-explorer-empty-state').length).toBe(1);
            expect(wrapper.find('FolderEmptyState').length).toBe(1);
            expect(wrapper.find('.content-explorer-empty-state-text').length).toBe(1);
        });

        test('should render the search state when isSearch is true', () => {
            const wrapper = renderComponent({ isSearch: true });

            expect(wrapper.find('SearchEmptyState').length).toBe(1);
        });
    });
});
