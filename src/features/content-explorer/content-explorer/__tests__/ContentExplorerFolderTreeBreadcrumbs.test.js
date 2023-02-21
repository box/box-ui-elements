import React from 'react';
import { ContentExplorerFolderTreeBreadcrumbsBase as ContentExplorerFolderTreeBreadcrumbs } from '../ContentExplorerFolderTreeBreadcrumbs';

describe('features/content-explorer/content-explorer/ContentExplorerFolderTreeBreadcrumbs', () => {
    const numTotalItems = 12;

    const renderComponent = props =>
        shallow(
            <ContentExplorerFolderTreeBreadcrumbs
                foldersPath={[]}
                intl={{ formatMessage: () => 'message', formatNumber: x => x }}
                numTotalItems={numTotalItems}
                {...props}
            />,
        );

    describe('render()', () => {
        test('should render correct breadcrumbs', () => {
            const foldersPath = [
                { id: '0', name: 'folder1' },
                { id: '1', name: 'folder2' },
                { id: '2', name: 'folder3' },
            ];
            const wrapper = renderComponent({ foldersPath });

            expect(wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs').length).toBe(1);
            expect(wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs-button').length).toBe(1);
            expect(wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs-icon').length).toBe(1);
            expect(wrapper.find('IconFolderTree').length).toBe(1);
            expect(wrapper.find('DropdownMenu').length).toBe(1);

            const lastBreadcrumb = wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs-text');

            expect(lastBreadcrumb.length).toBe(1);
            expect(lastBreadcrumb.prop('title')).toBe(foldersPath[foldersPath.length - 1].name);

            const breadcrumbTextId = lastBreadcrumb.find('FormattedMessage').prop('id');

            expect(breadcrumbTextId).toBe('boxui.contentExplorer.folderTreeBreadcrumbsText');
        });

        test('should render disabled folder tree button when isFolderTreeButtonDisabled is true', () => {
            const foldersPath = [{ id: '0', name: 'folder1' }];
            const wrapper = renderComponent({ isFolderTreeButtonDisabled: true, foldersPath });

            expect(wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs-button').prop('isDisabled')).toBe(true);
        });

        test('should not render button nor icon when isFolderTreeButtonHidden is true', () => {
            const foldersPath = [
                { id: '0', name: 'folder1' },
                { id: '1', name: 'folder2' },
                { id: '2', name: 'folder3' },
            ];
            const wrapper = renderComponent({ foldersPath, isFolderTreeButtonHidden: true });

            expect(wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs').length).toBe(1);
            expect(wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs-button').length).toBe(0);
            expect(wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs-icon').length).toBe(0);
            expect(wrapper.find('IconFolderTree').length).toBe(0);
            expect(wrapper.find('DropdownMenu').length).toBe(0);

            const lastBreadcrumb = wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs-text');

            expect(lastBreadcrumb.length).toBe(1);
            expect(lastBreadcrumb.prop('title')).toBe(foldersPath[foldersPath.length - 1].name);

            const breadcrumbTextId = lastBreadcrumb.find('FormattedMessage').prop('id');

            expect(breadcrumbTextId).toBe('boxui.contentExplorer.folderTreeBreadcrumbsText');
        });

        test('should render disabled folder tree button when isFolderTreeButtonDisabled is true', () => {
            const foldersPath = [{ id: '0', name: 'folder1' }];
            const wrapper = renderComponent({ isFolderTreeButtonDisabled: true, foldersPath });

            expect(wrapper.find('.bdl-ContentExplorerFolderTreeBreadcrumbs-button').prop('isDisabled')).toBe(true);
        });
    });

    describe('onBreadcrumbClick', () => {
        test('should call onBreadcrumbClick when breadcrumb in folder tree is clicked', () => {
            const breadcrumbIndex = 1;
            const event = {};
            const onBreadcrumbClick = jest.fn();
            const foldersPath = [
                { id: '0', name: 'folder1' },
                { id: '1', name: 'folder2' },
                { id: '2', name: 'folder3' },
            ];
            const wrapper = renderComponent({
                foldersPath,
                onBreadcrumbClick,
            });

            wrapper
                .find('[data-testid="folder-tree-item"]')
                .at(breadcrumbIndex)
                .simulate('click', event);

            expect(onBreadcrumbClick).toBeCalledTimes(1);
            expect(onBreadcrumbClick).toBeCalledWith(breadcrumbIndex, event);
        });
    });
});
