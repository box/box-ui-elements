import * as React from 'react';
import sinon from 'sinon';

import ContentExplorerModalContainer from '../ContentExplorerModalContainer';

describe('features/content-explorer/content-explorer-modal-container/ContentExplorerModalContainer', () => {
    const sandbox = sinon.sandbox.create();
    const initialSelectedItems = { 123: { id: '123', name: 'folder123' } };
    const renderComponent = (props, renderer = shallow) =>
        renderer(
            <ContentExplorerModalContainer
                onRequestClose={() => {}}
                isOpen
                contentExplorerMode="selectFile"
                initialFoldersPath={[{ id: '0', name: 'folder' }]}
                initialSelectedItems={initialSelectedItems}
                onEnterFolder={() => {}}
                onSearchSubmit={() => {}}
                onExitSearch={() => {}}
                items={[]}
                numItemsPerPage={100}
                numTotalItems={100}
                onLoadMoreItems={() => {}}
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = renderComponent();

            expect(wrapper.hasClass('content-explorer-modal-container')).toBe(true);
            expect(wrapper.find('ContentExplorerModal').length).toBe(1);
            expect(wrapper.find('ContentExplorerModal').hasClass('hidden')).toBe(false);
            expect(wrapper.find('ContentExplorerModal').prop('initialSelectedItems')).toEqual(initialSelectedItems);
            expect(wrapper.find('NewFolderModal').length).toBe(0);
        });

        test('should render component with class when specified', () => {
            const className = 'test';
            const wrapper = renderComponent({ className });

            expect(wrapper.hasClass('content-explorer-modal-container')).toBe(true);
            expect(wrapper.hasClass(className)).toBe(true);
        });

        test('should render ContentExplorerModal as hidden when isNewFolderModalOpen is true', () => {
            const wrapper = renderComponent();
            wrapper.setState({ isNewFolderModalOpen: true });

            expect(wrapper.find('ContentExplorerModal').hasClass('hidden')).toBe(true);
        });

        test('should render NewFolderModal when isNewFolderModalOpen is true', () => {
            const initialFoldersPath = [{ id: '0', name: 'folder' }];
            const parentFolderName = initialFoldersPath[0].name;
            const wrapper = renderComponent({ initialFoldersPath });
            wrapper.setState({ isNewFolderModalOpen: true });

            expect(wrapper.find('ContentExplorerModal').length).toBe(1);
            expect(wrapper.find('NewFolderModal').length).toBe(1);
            expect(wrapper.find('NewFolderModal').prop('parentFolderName')).toEqual(parentFolderName);
        });

        test('should pass searchInputProps, chooseButtonText, onSelectItem, onSelectedClick, noItemsRenderer and breadcrumbIcon to ContentExplorerModal', () => {
            const searchInputProps = { placeholder: 'test' };
            const chooseButtonText = 'test';
            const onSelectedClick = () => {};
            const onSelectItem = () => {};
            const noItemsRenderer = () => <div>No items</div>;
            const breadcrumbIcon = <div>Icon</div>;
            const wrapper = renderComponent({
                searchInputProps,
                chooseButtonText,
                onSelectedClick,
                onSelectItem,
                noItemsRenderer,
                breadcrumbIcon,
            });

            expect(wrapper.find('ContentExplorerModal').prop('searchInputProps')).toEqual(searchInputProps);
            expect(wrapper.find('ContentExplorerModal').prop('chooseButtonText')).toEqual(chooseButtonText);
            expect(wrapper.find('ContentExplorerModal').prop('onSelectedClick')).toEqual(onSelectedClick);
            expect(wrapper.find('ContentExplorerModal').prop('onSelectItem')).toEqual(onSelectItem);
            expect(wrapper.find('ContentExplorerModal').prop('noItemsRenderer')).toEqual(noItemsRenderer);
            expect(wrapper.find('ContentExplorerModal').prop('breadcrumbIcon')).toEqual(breadcrumbIcon);
        });

        test('should render ContentExplorerModal and NewFolderModal in Portal by default', () => {
            const wrapper = renderComponent({}, mount);
            wrapper.setState({ isNewFolderModalOpen: true });

            expect(wrapper.find('Portal').length).toBe(2);
        });

        test('should not render ContentExplorerModal and NewFolderModal in Portal if shouldNotUsePortal=true', () => {
            const wrapper = renderComponent({ shouldNotUsePortal: true }, mount);
            wrapper.setState({ isNewFolderModalOpen: true });

            expect(wrapper.find('Portal').length).toBe(0);
        });

        test('should pass infoNoticeText to ContentExplorerModal', () => {
            const infoNoticeText = 'info notice text';
            const wrapper = renderComponent({ infoNoticeText });
            expect(wrapper.find('ContentExplorerModal').prop('infoNoticeText')).toEqual(infoNoticeText);
        });
    });

    describe('onNewFolderModalShown', () => {
        test('should call onNewFolderModalShown when new folder button is clicked', () => {
            const onNewFolderModalShownSpy = sandbox.spy();
            const wrapper = renderComponent({
                onNewFolderModalShown: onNewFolderModalShownSpy,
            });
            wrapper.find('ContentExplorerModal').prop('onCreateNewFolderButtonClick')();

            expect(onNewFolderModalShownSpy.calledOnce).toBe(true);
        });
    });

    describe('onNewFolderModalClosed', () => {
        test('should call onNewFolderModalClosed when new folder modal is closed', () => {
            const onNewFolderModalClosedSpy = sandbox.spy();
            const wrapper = renderComponent({
                onNewFolderModalClosed: onNewFolderModalClosedSpy,
            });
            wrapper.setState({ isNewFolderModalOpen: true });
            wrapper.find('NewFolderModal').prop('onRequestClose')();

            expect(onNewFolderModalClosedSpy.calledOnce).toBe(true);
        });
    });
});
