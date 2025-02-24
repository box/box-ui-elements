import React, { act } from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import { ContentExplorerHeaderActionsBase as ContentExplorerHeaderActions } from '../ContentExplorerHeaderActions';
import ContentExplorerSearch from '../ContentExplorerSearch';

describe('features/content-explorer/content-explorer/ContentExplorerHeaderActions', () => {
    const sandbox = sinon.sandbox.create();

    const renderComponent = (props, shouldMount, children = null) => {
        const component = (
            <ContentExplorerHeaderActions
                contentExplorerMode="selectFile"
                foldersPath={[]}
                intl={{ formatMessage: () => {} }}
                onFoldersPathUpdated={() => {}}
                onEnterFolder={() => {}}
                onSearchSubmit={() => {}}
                onExitSearch={() => {}}
                {...props}
            >
                {children}
            </ContentExplorerHeaderActions>
        );
        return shouldMount ? mount(component) : shallow(component);
    };

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = renderComponent();

            expect(wrapper.hasClass('content-explorer-header-actions')).toBe(true);
            expect(wrapper.find('ContentExplorerSearch').length).toBe(1);
            expect(wrapper.find('ContentExplorerNewFolderButton').length).toBe(1);
            expect(wrapper.find('ContentExplorerBreadcrumbs').length).toBe(1);
        });

        test('should render ContentExplorerFolderTreeBreadcrumbs when hasFolderTreeBreadcrumbs is true', () => {
            const wrapper = renderComponent();
            wrapper.setProps({ hasFolderTreeBreadcrumbs: true });

            expect(wrapper.find('ContentExplorerFolderTreeBreadcrumbs').length).toBe(1);
            expect(wrapper.find('ContentExplorerBreadcrumbs').length).toBe(0);
        });

        test('should not render new folder button if showCreateNewFolderButton is false', () => {
            const wrapper = renderComponent({
                showCreateNewFolderButton: false,
            });

            expect(wrapper.find('ContentExplorerNewFolderButton').length).toBe(0);
        });

        test('should render disabled new folder button if isCreateNewFolderAllowed is false', () => {
            const wrapper = renderComponent({
                isCreateNewFolderAllowed: false,
            });

            expect(wrapper.find('ContentExplorerNewFolderButton').prop('isDisabled')).toBe(true);
        });

        test('should render disabled breadcrumbs up button if breacrumbs only has one folder', () => {
            const wrapper = renderComponent({
                foldersPath: [{ id: '0', name: 'item1', type: 'folder' }],
            });

            expect(wrapper.find('ContentExplorerBreadcrumbs').prop('isUpButtonDisabled')).toBe(true);
        });

        test('should render children', () => {
            const wrapper = renderComponent(
                {
                    foldersPath: [{ id: '0', name: 'item1', type: 'folder' }],
                },
                true,
                <div className="child" />,
            );

            expect(wrapper.find('.child').length).toEqual(1);
        });

        test("should render the contentExplorerSearch if customInput isn't defined", () => {
            const wrapper = renderComponent();
            expect(wrapper.containsMatchingElement(<ContentExplorerSearch />)).toEqual(true);
        });

        test("should render the contentExplorerSearch if customInput isn't defined", () => {
            const wrapper = renderComponent();
            expect(wrapper.containsMatchingElement(<ContentExplorerSearch />)).toEqual(true);
        });

        test('should render the customInput instead of contentExplorerSearch if customInput is defined', () => {
            const customInput = () => <div>MONSTAHHH</div>;
            const wrapper = renderComponent({ customInput });
            expect(wrapper.instance().props.customInput).toEqual(customInput);
            expect(wrapper).toMatchSnapshot();
        });

        test('should pass breadcrumbIcon to ContentExplorerBreadcrumbs', () => {
            const breadcrumbIcon = <div>Icon</div>;
            const wrapper = renderComponent({ breadcrumbIcon });
            expect(wrapper.find('ContentExplorerBreadcrumbs').prop('breadcrumbIcon')).toEqual(breadcrumbIcon);
        });
    });

    describe('onEnterFolder', () => {
        test("should call onEnterFolder when clicking the folder's breadcrumb", () => {
            const foldersPath = [
                { id: '0', name: 'item1' },
                { id: '1', name: 'item2' },
                { id: '2', name: 'item3' },
            ];
            const clickedFolderIndex = 1;
            const clickedFolder = foldersPath[clickedFolderIndex];
            const onEnterFolderSpy = sandbox.spy();
            const wrapper = renderComponent({
                foldersPath,
                onEnterFolder: onEnterFolderSpy,
            });

            wrapper.instance().handleBreadcrumbClick(clickedFolderIndex);

            expect(onEnterFolderSpy.withArgs(clickedFolder).calledOnce).toBe(true);
        });

        test('should not call onEnterFolder when clicking the last breadcrumb', () => {
            const foldersPath = [
                { id: '0', name: 'item1' },
                { id: '1', name: 'item2' },
            ];
            const onEnterFolderSpy = sandbox.spy();
            const wrapper = renderComponent({
                foldersPath,
                onEnterFolder: onEnterFolderSpy,
            });

            wrapper.instance().handleBreadcrumbClick(1);

            expect(onEnterFolderSpy.notCalled).toBe(true);
        });
    });

    describe('onSearchSubmit', () => {
        test('should call onSearchSubmit when clicking the search results breadcrumb', () => {
            const foldersPath = [
                { id: 'search_results_id', name: 'Search Results' },
                { id: '0', name: 'folder' },
            ];
            const onSearchSubmitSpy = sandbox.spy();
            const searchInput = 'test';
            const wrapper = renderComponent(
                {
                    foldersPath,
                    onSearchSubmit: onSearchSubmitSpy,
                },
                true,
            );

            // Submit search
            act(() => {
                wrapper.setState({ searchInput });
            });
            wrapper.find('form').simulate('submit', { preventDefault: () => {} });
            // Click search results breadcrumb
            wrapper.instance().handleBreadcrumbClick(0);

            expect(
                // First call is for submitting the search
                // Second call is for clicking the search results breadcrumb
                onSearchSubmitSpy.withArgs(searchInput).calledTwice,
            ).toBe(true);
        });
    });

    describe('onExitSearch', () => {
        const foldersPath = [{ id: 'search_results_id', name: 'Search Results' }];
        let onExitSearchSpy;

        beforeEach(() => {
            onExitSearchSpy = sandbox.spy();
        });

        test('should call onExitSearch when submitting an empty search input', () => {
            const wrapper = renderComponent({ foldersPath, onExitSearch: onExitSearchSpy }, true);

            wrapper.find('form').simulate('submit', { preventDefault: () => {} });

            expect(onExitSearchSpy.calledOnce).toBe(true);
        });

        test('should call onExitSearch when clicking the clear search button', () => {
            const wrapper = renderComponent({
                foldersPath,
                onExitSearch: onExitSearchSpy,
            });

            wrapper.setState({ searchInput: 'test' });
            wrapper.instance().handleClearSearchButtonClick();

            expect(onExitSearchSpy.calledOnce).toBe(true);
        });

        test('should call onExitSearch when clicking the breadcrumbs up button to exit search', () => {
            const wrapper = renderComponent({ foldersPath, onExitSearch: onExitSearchSpy }, true);

            wrapper.find('.content-explorer-breadcrumbs-up-button').hostNodes().simulate('click');

            expect(onExitSearchSpy.calledOnce).toBe(true);
        });

        test('should call onExitSearch() with folder before search when called', () => {
            const folderBeforeSearch = { id: 123 };
            const wrapper = renderComponent(
                {
                    foldersPath,
                    onExitSearch: sandbox.mock().withExactArgs(folderBeforeSearch),
                },
                false,
            );
            const instance = wrapper.instance();
            instance.foldersPathBeforeSearch = [folderBeforeSearch];

            instance.exitSearch();
        });
    });

    describe('onFoldersPathUpdated', () => {
        test('should call onFoldersPathUpdated when submitting search', () => {
            const foldersPath = [{ id: 'search_results_id', name: 'Search Results' }];
            const searchInput = 'test';
            const onFoldersPathUpdatedSpy = sandbox.spy();
            const wrapper = renderComponent(
                {
                    foldersPath,
                    onFoldersPathUpdated: onFoldersPathUpdatedSpy,
                },
                true,
            );

            // Submit search
            wrapper.setState({ searchInput });
            wrapper.find('form').simulate('submit', { preventDefault: () => {} });

            expect(onFoldersPathUpdatedSpy.calledOnce).toBe(true);
        });

        test('should call onFoldersPathUpdated when exiting search', () => {
            const foldersPath = [{ id: 'search_results_id', name: 'Search Results' }];
            const onFoldersPathUpdatedSpy = sandbox.spy();

            const wrapper = renderComponent({ foldersPath, onFoldersPathUpdated: onFoldersPathUpdatedSpy }, true);

            wrapper.find('.content-explorer-breadcrumbs-up-button').hostNodes().simulate('click');

            expect(onFoldersPathUpdatedSpy.calledOnce).toBe(true);
        });
    });
});
