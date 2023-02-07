import React from 'react';
import sinon from 'sinon';

import { ContentExplorerFolderTreeBreadcrumbsBase as ContentExplorerFolderTreeBreadcrumbs } from '../ContentExplorerFolderTreeBreadcrumbs';

describe('features/content-explorer/content-explorer/ContentExplorerFolderTreeBreadcrumbs', () => {
    const sandbox = sinon.sandbox.create();

    const renderComponent = props =>
        shallow(
            <ContentExplorerFolderTreeBreadcrumbs
                foldersPath={[]}
                intl={{ formatMessage: () => 'message' }}
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
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

            expect(wrapper.find('.content-explorer-folder-tree-container').length).toBe(1);
            expect(wrapper.find('.content-explorer-folder-tree-button').length).toBe(1);
            expect(wrapper.find('IconBreadcrumbArrow').length).toBe(1);
            expect(wrapper.find('IconFolderTree').length).toBe(1);
            expect(wrapper.find('DropdownMenu').length).toBe(1);

            const lastBreadcrumb = wrapper.find('.folder-title-breadcrumb-text');

            expect(lastBreadcrumb.length).toBe(1);
            expect(lastBreadcrumb.prop('title')).toEqual(foldersPath[foldersPath.length - 1].name);
            expect(lastBreadcrumb.text()).toEqual(`${foldersPath[foldersPath.length - 1].name} (${numTotalItems})`);
        });

        test('should render disabled up button when isUpButtonDisabled is true', () => {
            const foldersPath = [{ id: '0', name: 'folder1' }];
            const wrapper = renderComponent({ isUpButtonDisabled: true, foldersPath });

            expect(wrapper.find('.content-explorer-folder-tree-button').prop('isDisabled')).toBe(true);
        });
    });

    describe('onBreadcrumbClick', () => {
        test('should call onBreadcrumbClick when breadcrumb in folder tree is clicked', () => {
            const breadcrumbIndex = 1;
            const event = {};
            const foldersPath = [
                { id: '0', name: 'folder1' },
                { id: '1', name: 'folder2' },
                { id: '2', name: 'folder3' },
            ];
            const onBreadcrumbClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                foldersPath,
                onBreadcrumbClick: onBreadcrumbClickSpy,
            });

            wrapper
                .find('[data-testid="breadcrumb-lnk"]')
                .at(breadcrumbIndex)
                .simulate('click', event);

            expect(onBreadcrumbClickSpy.calledOnce).toBe(true);
            expect(onBreadcrumbClickSpy.calledWithExactly(breadcrumbIndex, event)).toBe(true);
        });
    });
});
