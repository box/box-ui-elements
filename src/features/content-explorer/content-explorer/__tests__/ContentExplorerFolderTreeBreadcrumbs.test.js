import React from 'react';
import { ContentExplorerFolderTreeBreadcrumbsBase as ContentExplorerFolderTreeBreadcrumbs } from '../ContentExplorerFolderTreeBreadcrumbs';

describe('features/content-explorer/content-explorer/ContentExplorerFolderTreeBreadcrumbs', () => {
    const renderComponent = props =>
        shallow(
            <ContentExplorerFolderTreeBreadcrumbs
                foldersPath={[]}
                intl={{ formatMessage: () => 'message', formatNumber: x => x }}
                {...props}
            />,
        );

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('render()', () => {
        test('should render correct breadcrumbs', () => {
            const foldersPath = [
                { id: '0', name: 'folder1' },
                { id: '1', name: 'folder2' },
                { id: '2', name: 'folder3' },
            ];
            const numTotalItems = 12;
            const wrapper = renderComponent({
                foldersPath,
                numTotalItems,
            });

            expect(wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs').length).toBe(1);
            expect(wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs-button').length).toBe(1);
            expect(wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs-iconArrow16').length).toBe(1);
            expect(wrapper.find('IconFolderTree').length).toBe(1);
            expect(wrapper.find('DropdownMenu').length).toBe(1);

            const lastBreadcrumb = wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs-text');

            expect(lastBreadcrumb.length).toBe(1);
            expect(lastBreadcrumb.prop('title')).toEqual(foldersPath[foldersPath.length - 1].name);
            expect(lastBreadcrumb.text()).toEqual(`${foldersPath[foldersPath.length - 1].name} (${numTotalItems})`);
        });

        test('should render disabled folder tree button when isFolderTreeButtonDisabled is true', () => {
            const numTotalItems = 12;
            const foldersPath = [{ id: '0', name: 'folder1' }];
            const wrapper = renderComponent({ isFolderTreeButtonDisabled: true, foldersPath, numTotalItems });

            expect(wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs-button').prop('isDisabled')).toBe(true);
        });
    });

    describe('onBreadcrumbClick', () => {
        test('should call onBreadcrumbClick when breadcrumb in folder tree is clicked', () => {
            const breadcrumbIndex = 1;
            const event = {};
            const numTotalItems = 12;
            const onBreadcrumbClick = jest.fn();
            const foldersPath = [
                { id: '0', name: 'folder1' },
                { id: '1', name: 'folder2' },
                { id: '2', name: 'folder3' },
            ];
            const wrapper = renderComponent({
                foldersPath,
                onBreadcrumbClick,
                numTotalItems,
            });

            wrapper
                .find('[data-testid="folder-tree-item"]')
                .at(breadcrumbIndex)
                .simulate('click', event);

            expect(onBreadcrumbClick).toHaveBeenCalledTimes(1);
            expect(onBreadcrumbClick).toHaveBeenCalledWith(breadcrumbIndex, event);
        });
    });
});
