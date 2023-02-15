import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import ContentExplorer from '..';
import ContentExplorerModes from '../../modes';
import ContentExplorerHeaderActions from '../ContentExplorerHeaderActions';

describe('features/content-explorer/content-explorer/ContentExplorer', () => {
    const sandbox = sinon.sandbox.create();

    const renderComponent = (props, shouldMount) => {
        const component = (
            <ContentExplorer
                contentExplorerMode={ContentExplorerModes.SELECT_FILE}
                initialFoldersPath={[
                    {
                        id: '0',
                        name: 'folder',
                    },
                ]}
                onEnterFolder={() => {}}
                onSearchSubmit={() => {}}
                onExitSearch={() => {}}
                items={[]}
                numItemsPerPage={100}
                numTotalItems={100}
                onLoadMoreItems={() => {}}
                listWidth={500}
                listHeight={500}
                {...props}
            />
        );

        return shouldMount ? mount(component) : shallow(component);
    };

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = renderComponent();

            expect(wrapper.hasClass('content-explorer')).toBe(true);
            expect(wrapper.find('ContentExplorerHeaderActions').length).toBe(1);
            expect(wrapper.find('ItemList').length).toBe(1);
            expect(wrapper.find('ContentExplorerActionButtons').length).toBe(1);
        });

        test('should render component with class when specified', () => {
            const className = 'test';
            const wrapper = renderComponent({ className });

            expect(wrapper.hasClass('content-explorer')).toBe(true);
            expect(wrapper.hasClass(className)).toBe(true);
        });

        test('should render component with custom attribute when specified', () => {
            const wrapper = renderComponent({
                'data-resin-feature': 'folderpicker',
            });

            expect(wrapper.prop('data-resin-feature')).toEqual('folderpicker');
        });

        test('should render ContentExplorerHeaderActions with headerActionsAccessory prop', () => {
            const headerActionsAccessory = <div className="header-actions-accessory" />;
            const wrapper = renderComponent({ headerActionsAccessory });

            expect(wrapper.find(ContentExplorerHeaderActions).find('.header-actions-accessory').length).toBe(1);
        });

        test('should pass onSelectedClick to ContentExplorerActionButtons', () => {
            const onSelectedClick = () => {};
            const wrapper = renderComponent({ onSelectedClick });
            expect(wrapper.find('ContentExplorerActionButtons').prop('onSelectedClick')).toEqual(onSelectedClick);
        });

        test('should render ContentExplorerSelectAll with isSelectAllAllowed = true', () => {
            const isSelectAllAllowed = true;
            const wrapper = renderComponent({ isSelectAllAllowed });

            expect(wrapper.exists('ContentExplorerSelectAll')).toBeTruthy();
        });

        test('should not render ContentExplorerSelectAll with isSelectAllAllowed = false', () => {
            const isSelectAllAllowed = false;
            const wrapper = renderComponent({ isSelectAllAllowed });

            expect(wrapper.find('ContentExplorerSelectAll').length).toBe(0);
        });

        test('should pass numTotalItems to ContentExplorerSelectAll', () => {
            const numTotalItems = 12345;
            const wrapper = renderComponent({ isSelectAllAllowed: true, numTotalItems });
            expect(wrapper.find('ContentExplorerSelectAll').prop('numTotalItems')).toEqual(numTotalItems);
        });

        test('should pass isSelectAllChecked to ContentExplorerSelectAll', () => {
            const isSelectAllChecked = true;
            const wrapper = renderComponent({ isSelectAllAllowed: true });
            wrapper.setState({ isSelectAllChecked });

            expect(wrapper.find('ContentExplorerSelectAll').prop('isSelectAllChecked')).toEqual(isSelectAllChecked);
        });

        test('should render ContentExplorerIncludeSubfolders with canIncludeSubfolders = true and isSelectAllAllowed = true', () => {
            const isSelectAllAllowed = true;
            const canIncludeSubfolders = true;
            const wrapper = renderComponent({ canIncludeSubfolders, isSelectAllAllowed });

            expect(wrapper.exists('ContentExplorerIncludeSubfolders')).toBeTruthy();
        });

        test('should not render ContentExplorerIncludeSubfolders with canIncludeSubfolders = false and isSelectAllAllowed = true', () => {
            const isSelectAllAllowed = true;
            const canIncludeSubfolders = false;
            const wrapper = renderComponent({ canIncludeSubfolders, isSelectAllAllowed });

            expect(wrapper.exists('ContentExplorerSelectAll')).toBeTruthy();
            expect(wrapper.find('ContentExplorerIncludeSubfolders').length).toBe(0);
        });

        test('should not render ContentExplorerIncludeSubfolders nor ContentExplorerSelectAll with canIncludeSubfolders = true and isSelectAllAllowed = false', () => {
            const isSelectAllAllowed = false;
            const canIncludeSubfolders = true;
            const wrapper = renderComponent({ canIncludeSubfolders, isSelectAllAllowed });

            expect(wrapper.find('ContentExplorerSelectAll').length).toBe(0);
            expect(wrapper.find('ContentExplorerIncludeSubfolders').length).toBe(0);
        });

        test('should not render ContentExplorerIncludeSubfolders nor ContentExplorerSelectAll with canIncludeSubfolders = false and isSelectAllAllowed = false', () => {
            const isSelectAllAllowed = false;
            const canIncludeSubfolders = false;
            const wrapper = renderComponent({ canIncludeSubfolders, isSelectAllAllowed });

            expect(wrapper.find('ContentExplorerSelectAll').length).toBe(0);
            expect(wrapper.find('ContentExplorerIncludeSubfolders').length).toBe(0);
        });

        test('should pass isFolderPresent to ContentExplorerIncludeSubfolders', () => {
            const items = [
                { id: 'item1', name: 'name1', type: 'folder' },
                { id: 'item2', name: 'name2' },
            ];
            const isFolderPresent = true;

            const wrapper = renderComponent({
                canIncludeSubfolders: true,
                isSelectAllAllowed: true,
                items,
            });
            expect(wrapper.find('ContentExplorerIncludeSubfolders').prop('isFolderPresent')).toEqual(isFolderPresent);
        });

        test('should pass includeSubfolders to ContentExplorerIncludeSubfolders', () => {
            const includeSubfolders = true;
            const wrapper = renderComponent({ canIncludeSubfolders: true, isSelectAllAllowed: true });
            wrapper.setState({ includeSubfolders });
            expect(wrapper.find('ContentExplorerIncludeSubfolders').prop('hideSelectAllCheckbox')).toEqual(
                includeSubfolders,
            );
        });

        test('should pass isSelectAllChecked to ContentExplorerIncludeSubfolders', () => {
            const isSelectAllChecked = true;
            const wrapper = renderComponent({ canIncludeSubfolders: true, isSelectAllAllowed: true });
            wrapper.setState({ isSelectAllChecked });
            expect(wrapper.find('ContentExplorerIncludeSubfolders').prop('isSelectAllChecked')).toEqual(
                isSelectAllChecked,
            );
        });

        test('should pass noFoldersSelected to ContentExplorerIncludeSubfolders', () => {
            const selectedItems = {
                item1: { id: 'item1', name: 'name1', type: 'file' },
                item2: { id: 'item2', name: 'name2' },
            };
            const noFoldersSelected = true;

            const wrapper = renderComponent({ canIncludeSubfolders: true, isSelectAllAllowed: true });
            wrapper.setState({ selectedItems });
            expect(wrapper.find('ContentExplorerIncludeSubfolders').prop('noFoldersSelected')).toEqual(
                noFoldersSelected,
            );
        });

        test('should pass numOfSelectedItems to ContentExplorerIncludeSubfolders', () => {
            const selectedItems = { item1: { id: 'item1', name: 'name1' }, item2: { id: 'item2', name: 'name2' } };
            const numOfSelectedItems = 2;

            const wrapper = renderComponent({ canIncludeSubfolders: true, isSelectAllAllowed: true });
            wrapper.setState({ selectedItems });
            expect(wrapper.find('ContentExplorerIncludeSubfolders').prop('numOfSelectedItems')).toEqual(
                numOfSelectedItems,
            );
        });

        test('should pass includeSubfolderToggleDisabled to ContentExplorerIncludeSubfolders', () => {
            const items = [{ isLoading: true }, { isLoading: true }];
            const includeSubfolderToggleDisabled = true;

            const wrapper = renderComponent({
                canIncludeSubfolders: true,
                isSelectAllAllowed: true,
                items,
            });
            expect(wrapper.find('ContentExplorerIncludeSubfolders').prop('isToggleDisabled')).toEqual(
                includeSubfolderToggleDisabled,
            );
        });

        test("customInput should be false if the props isn't passed down", () => {
            const wrapper = renderComponent();
            expect(wrapper.find('ContentExplorerHeaderActions').prop('customInput')).toBe(undefined);
        });

        test('customInput should be contain a custom input if the prop is passed', () => {
            const customInput = () => <div>BLARGH TESTS</div>;
            const wrapper = renderComponent({ customInput });
            expect(wrapper.find('ContentExplorerHeaderActions').prop('customInput')).toEqual(customInput);
            expect(wrapper).toMatchSnapshot();
        });

        [
            {
                contentExplorerMode: ContentExplorerModes.SELECT_FILE,
            },
            {
                contentExplorerMode: ContentExplorerModes.MULTI_SELECT,
            },
        ].forEach(({ contentExplorerMode }) => {
            test('should render disabled action buttons if no item is selected', () => {
                const wrapper = renderComponent({
                    contentExplorerMode,
                });

                expect(wrapper.find('ContentExplorerActionButtons').prop('areButtonsDisabled')).toBe(true);
            });
        });

        [
            {
                contentExplorerMode: ContentExplorerModes.SELECT_FOLDER,
            },
            {
                contentExplorerMode: ContentExplorerModes.MOVE_COPY,
            },
        ].forEach(({ contentExplorerMode }) => {
            test('should render disabled action buttons if currentFolder isActionDisabled is true', () => {
                const wrapper = renderComponent({
                    contentExplorerMode,
                });

                wrapper.setState({
                    foldersPath: [{ id: '0', isActionDisabled: true, name: 'name' }],
                });

                expect(wrapper.find('ContentExplorerActionButtons').prop('areButtonsDisabled')).toBe(true);
            });
        });

        [
            {
                contentExplorerMode: ContentExplorerModes.SELECT_FOLDER,
            },
            {
                contentExplorerMode: ContentExplorerModes.MOVE_COPY,
            },
        ].forEach(({ contentExplorerMode }) => {
            test('should render disabled action buttons if selected item isActionDisabled is true', () => {
                const wrapper = renderComponent({
                    contentExplorerMode,
                });

                wrapper.setState({
                    selectedItems: {
                        '1': {
                            id: '1',
                            isActionDisabled: true,
                            name: 'name',
                        },
                    },
                });

                expect(wrapper.find('ContentExplorerActionButtons').prop('areButtonsDisabled')).toBe(true);
            });
        });

        [
            {
                contentExplorerMode: ContentExplorerModes.SELECT_FILE,
            },
            {
                contentExplorerMode: ContentExplorerModes.SELECT_FOLDER,
            },
            {
                contentExplorerMode: ContentExplorerModes.MOVE_COPY,
            },
            {
                contentExplorerMode: ContentExplorerModes.MULTI_SELECT,
            },
        ].forEach(({ contentExplorerMode }) => {
            test("should render disabled action buttons if selected item's isActionDisabled is true", () => {
                const items = [
                    { id: '1', name: 'item1', isActionDisabled: true },
                    { id: '2', name: 'item2' },
                    { id: '3', name: 'item3' },
                ];

                const selectedItems = { '1': items[0] };
                const wrapper = renderComponent({
                    contentExplorerMode,
                    items,
                });

                wrapper.setState({ selectedItems });

                expect(wrapper.find('ContentExplorerActionButtons').prop('areButtonsDisabled')).toBe(true);
            });
        });

        [
            {
                contentExplorerMode: 'selectFolder',
            },
            {
                contentExplorerMode: 'moveCopy',
            },
        ].forEach(({ contentExplorerMode }) => {
            test("should render disabled action buttons if current folder's isActionDisabled is true", () => {
                const initialFoldersPath = [
                    {
                        id: '0',
                        name: 'folder',
                        isActionDisabled: true,
                    },
                ];
                const wrapper = renderComponent({
                    contentExplorerMode,
                    initialFoldersPath,
                });

                expect(wrapper.find('ContentExplorerActionButtons').prop('areButtonsDisabled')).toBe(true);
            });
        });

        test('should render with action buttons enabled in MULTI_SELECT mode if there is no selection made when isNoSelectionAllowed is true', () => {
            const items = [
                { id: '1', name: 'item1' },
                { id: '2', name: 'item2' },
                { id: '3', name: 'item3' },
            ];

            const wrapper = renderComponent({
                contentExplorerMode: ContentExplorerModes.MULTI_SELECT,
                items,
                isNoSelectionAllowed: true,
            });

            expect(wrapper.find('ContentExplorerActionButtons').prop('areButtonsDisabled')).toBe(false);
        });
    });

    describe('onEnterFolder', () => {
        const items = [{ id: '123', name: 'item1', type: 'folder' }];
        const initialFoldersPath = [
            {
                id: '0',
                name: 'folder1',
            },
            {
                id: '1',
                name: 'folder2',
            },
        ];
        let onEnterFolderSpy;
        let wrapper;

        beforeEach(() => {
            onEnterFolderSpy = sandbox.spy();
            wrapper = renderComponent(
                {
                    items,
                    initialFoldersPath,
                    onEnterFolder: onEnterFolderSpy,
                },
                true,
            );
        });

        test("should call onEnterFolder when clicking a folder's name", () => {
            const clickedFolderIndex = 0;
            const clickedFolder = items[clickedFolderIndex];
            const newFoldersPath = initialFoldersPath.concat([clickedFolder]);

            wrapper
                .find('.item-list-name')
                .first()
                .simulate('click');

            expect(onEnterFolderSpy.withArgs(clickedFolder, newFoldersPath).calledOnce).toBe(true);
        });

        test('should call onEnterFolder when double clicking a folder', () => {
            const clickedFolderIndex = 0;
            const clickedFolder = items[clickedFolderIndex];
            const newFoldersPath = initialFoldersPath.concat([clickedFolder]);

            wrapper
                .find('.item-list-name')
                .first()
                .simulate('doubleClick');

            expect(onEnterFolderSpy.withArgs(clickedFolder, newFoldersPath).calledOnce).toBe(true);
        });

        test('should not call onEnterFolder when clicking disabled folder name', () => {
            const disabledItems = [{ id: '123', name: 'item1', type: 'folder', isDisabled: true }];
            wrapper = renderComponent(
                {
                    items: disabledItems,
                    initialFoldersPath,
                    onEnterFolder: onEnterFolderSpy,
                },
                true,
            );

            const clickedFolderIndex = 0;
            const clickedFolder = items[clickedFolderIndex];
            const newFoldersPath = initialFoldersPath.concat([clickedFolder]);

            wrapper
                .find('.item-list-name')
                .first()
                .simulate('click');

            expect(onEnterFolderSpy.withArgs(clickedFolder, newFoldersPath).calledOnce).toBe(false);
        });
    });

    describe('onSelectItem', () => {
        let onSelectItemSpy;

        beforeEach(() => {
            onSelectItemSpy = sandbox.spy();
        });

        test('should call onSelectItem with the selected item when clicking an item', () => {
            const clickedItemIndex = 1;
            const items = [
                { id: '1', name: 'item1' },
                { id: '2', name: 'item2' },
                { id: '3', name: 'item3' },
            ];
            const wrapper = renderComponent({ items, onSelectItem: onSelectItemSpy }, true);

            wrapper
                .find('.table-row')
                .at(clickedItemIndex)
                .simulate('click');

            expect(onSelectItemSpy.withArgs(items[clickedItemIndex], clickedItemIndex).calledOnce).toBe(true);
        });

        test('should call onSelectItem with the selected item and store the latest item in the selectedItems state when clicking multiple items', () => {
            const clickedItemIndex = 1;
            const clickedItemIndex2 = 2;
            const items = [
                { id: '1', name: 'item1' },
                { id: '2', name: 'item2' },
                { id: '3', name: 'item3' },
            ];
            const wrapper = renderComponent({ items, onSelectItem: onSelectItemSpy }, true);

            wrapper
                .find('.table-row')
                .at(clickedItemIndex)
                .simulate('click');

            wrapper
                .find('.table-row')
                .at(clickedItemIndex2)
                .simulate('click');

            expect(onSelectItemSpy.withArgs(items[clickedItemIndex], clickedItemIndex).calledOnce).toBe(true);

            expect(onSelectItemSpy.withArgs(items[clickedItemIndex2], clickedItemIndex2).calledOnce).toBe(true);

            expect(Object.keys(wrapper.state('selectedItems')).length).toEqual(1);
            expect(wrapper.state('selectedItems')['3']).toEqual(items[clickedItemIndex2]);
        });

        test('should call onSelectItem with the selected items and store all selected item in the selectedItems state when clicking multiple items [Multi-Select mode]', () => {
            const clickedItemIndex = 1;
            const clickedItemIndex2 = 2;
            const items = [
                { id: '1', name: 'item1' },
                { id: '2', name: 'item2' },
                { id: '3', name: 'item3' },
            ];
            const wrapper = renderComponent(
                {
                    items,
                    onSelectItem: onSelectItemSpy,
                    contentExplorerMode: ContentExplorerModes.MULTI_SELECT,
                },
                true,
            );

            wrapper
                .find('.table-row')
                .at(clickedItemIndex)
                .simulate('click');

            wrapper
                .find('.table-row')
                .at(clickedItemIndex2)
                .simulate('click');

            expect(onSelectItemSpy.withArgs(items[clickedItemIndex], clickedItemIndex).calledOnce).toBe(true);

            expect(onSelectItemSpy.withArgs(items[clickedItemIndex2], clickedItemIndex2).calledOnce).toBe(true);

            expect(Object.keys(wrapper.state('selectedItems')).length).toEqual(2);
            expect(wrapper.state('selectedItems')['2']).toEqual(items[clickedItemIndex]);

            expect(wrapper.state('selectedItems')['3']).toEqual(items[clickedItemIndex2]);
        });

        test('should not call onSelectItem when clicking a disabled item', () => {
            const items = [{ id: '1', name: 'item1', isDisabled: true }];
            const wrapper = renderComponent({ items, onSelectItem: onSelectItemSpy }, true);

            wrapper.find('.table-row').simulate('click');

            expect(onSelectItemSpy.notCalled).toBe(true);
        });

        test('should not call onSelectItem when clicking a loading item', () => {
            const items = [{ name: 'item1', isLoading: true }];
            const wrapper = renderComponent({ items, onSelectItem: onSelectItemSpy }, true);

            wrapper.find('.table-row').simulate('click');

            expect(onSelectItemSpy.notCalled).toBe(true);
        });
    });

    describe('onChooseItems', () => {
        let onChooseItemsSpy;

        beforeEach(() => {
            onChooseItemsSpy = sandbox.spy();
        });

        test('should call onChooseItems with the clicked file when double clicking a file', () => {
            const items = [{ id: '1', name: 'item1', type: 'file' }];
            const selectedItems = { '1': items[0] };
            const wrapper = renderComponent({ items, onChooseItems: onChooseItemsSpy }, true);

            // Need to make the item selected first because simulating a double click doesn't actually click anything
            wrapper.setState({ selectedItems });
            wrapper.find('.table-row').simulate('doubleClick');

            expect(onChooseItemsSpy.withArgs(items).calledOnce).toBe(true);
        });
    });

    describe('handleExitSearch()', () => {
        test('should set search mode to false and call onExitSearch() when called', () => {
            const folderBeforeSearch = { id: 123 };
            const wrapper = renderComponent(
                {
                    onExitSearch: sandbox.mock().withExactArgs(folderBeforeSearch),
                },
                false,
            );
            wrapper.setState({ isInSearchMode: true });

            wrapper.instance().handleExitSearch(folderBeforeSearch);

            expect(wrapper.state('isInSearchMode')).toBe(false);
        });
    });

    describe('renderItemListEmptyState()', () => {
        test('should show search empty state when viewing search results', () => {
            const wrapper = renderComponent({}, false);
            wrapper.setState({
                foldersPath: [{ id: '123', name: 'name' }],
                isInSearchMode: true,
            });
            const Component = wrapper.instance().renderItemListEmptyState;
            const component = shallow(<Component />);

            expect(component.prop('isSearch')).toBe(true);
        });

        test('should not show search empty state when viewing folder in search results', () => {
            const wrapper = renderComponent({}, false);
            wrapper.setState({
                foldersPath: [
                    { id: '123', name: '123' },
                    { id: '234', name: '234' },
                ],
                isInSearchMode: true,
            });
            const Component = wrapper.instance().renderItemListEmptyState;
            const component = shallow(<Component />);

            expect(component.prop('isSearch')).toBe(false);
        });
    });

    describe('handleDocumentClick', () => {
        test('should deselect when the click did not occur inside the content explorer and not in multi select mode', () => {
            const item = { id: 'id', name: 'name' };
            const wrapper = renderComponent({ contentExplorerMode: ContentExplorerModes.SELECT_FILE }, false);
            wrapper.setState({ selectedItems: { id: item } });

            const domNode = { contains: sandbox.spy() };
            const event = { target: sandbox.spy() };

            wrapper.instance().domNode = domNode;

            expect(Object.keys(wrapper.state('selectedItems')).length).toEqual(1);
            wrapper.instance().handleDocumentClick(event);
            expect(Object.keys(wrapper.state('selectedItems')).length).toEqual(0);
        });

        test('should not deselect when the click occurred inside the content explorer', () => {
            const item = { id: 'id', name: 'name' };
            const wrapper = renderComponent({}, false);
            wrapper.setState({ selectedItems: { id: item } });

            const domNode = { contains: sandbox.spy() };
            const event = { target: domNode };

            wrapper.instance().domNode = domNode;

            expect(Object.keys(wrapper.state('selectedItems')).length).toEqual(1);
            wrapper.instance().handleDocumentClick(event);
            expect(Object.keys(wrapper.state('selectedItems')).length).toEqual(1);
        });
    });

    describe('handleContentExplorerClick and shouldDeselectItems', () => {
        test('should deselect when not in multi select mode', () => {
            const item = { id: 'id', name: 'name' };
            const wrapper = renderComponent({ contentExplorerMode: ContentExplorerModes.SELECT_FILE }, false);
            wrapper.setState({ selectedItems: { id: item } });
            const event = {};

            expect(Object.keys(wrapper.state('selectedItems')).length).toEqual(1);
            wrapper.instance().handleContentExplorerClick(event);
            expect(Object.keys(wrapper.state('selectedItems')).length).toEqual(0);
        });

        test('should not deselect when in multi select mode', () => {
            const item = { id: 'id', name: 'name' };
            const wrapper = renderComponent({ contentExplorerMode: ContentExplorerModes.MULTI_SELECT }, false);
            wrapper.setState({ selectedItems: { id: item } });
            const event = {};
            wrapper.instance().isEventOnHeadActions = sandbox.stub().returns(false);
            wrapper.instance().isEventOnBreadcrumb = sandbox.stub().returns(false);

            expect(Object.keys(wrapper.state('selectedItems')).length).toBe(1);
            wrapper.instance().handleContentExplorerClick(event);
            expect(Object.keys(wrapper.state('selectedItems')).length).toBe(1);
        });

        [
            {
                isEventOnHeadActions: true,
                isEventOnBreadcrumb: false,
            },
            {
                isEventOnHeadActions: false,
                isEventOnBreadcrumb: true,
            },
        ].forEach(({ isEventOnHeadActions, isEventOnBreadcrumb }) => {
            test('should assert if unselected have occurred given the different click input targets', () => {
                const item = { id: 'id', name: 'name' };
                const wrapper = renderComponent(
                    {
                        contentExplorerMode: ContentExplorerModes.MULTI_SELECT,
                    },
                    false,
                );
                wrapper.setState({ selectedItems: { id: item } });
                const event = {};
                wrapper.instance().isEventOnHeadActions = sandbox.stub().returns(isEventOnHeadActions);
                wrapper.instance().isEventOnBreadcrumb = sandbox.stub().returns(isEventOnBreadcrumb);

                expect(Object.keys(wrapper.state('selectedItems')).length).toEqual(1);
                wrapper.instance().handleContentExplorerClick(event);
                expect(Object.keys(wrapper.state('selectedItems')).length).toEqual(1);
            });
        });
    });

    describe('toggleSelectedItem', () => {
        [
            {
                selectedItems: { id: { id: 'id', name: 'name' } },
                item: { id: 'id', name: 'name' },
                expectedLength: 0,
            },
            {
                selectedItems: { id: { id: 'id', name: 'name' } },
                item: { id: 'id2', name: 'name' },
                expectedLength: 2,
            },
            {
                selectedItems: {},
                item: { id: 'id', name: 'name' },
                expectedLength: 1,
            },
        ].forEach(({ selectedItems, item, expectedLength }) => {
            test('should toggle', () => {
                const wrapper = renderComponent(
                    {
                        contentExplorerMode: ContentExplorerModes.SELECT_FILE,
                    },
                    false,
                );

                const result = wrapper.instance().toggleSelectedItem(selectedItems, item);
                expect(Object.keys(result).length).toEqual(expectedLength);
            });
            test('should set initialSelectedItems', () => {
                const wrapper = renderComponent(
                    {
                        initialSelectedItems: selectedItems,
                        contentExplorerMode: ContentExplorerModes.SELECT_FILE,
                    },
                    false,
                );
                const actionButtons = wrapper.find('ContentExplorerActionButtons');
                expect(actionButtons.prop('selectedItems')).toEqual(selectedItems);
            });
        });
    });

    describe('handleSelectAllClick()', () => {
        const items = [
            { id: 'item1', name: 'name1' },
            { id: 'item2', name: 'name2' },
        ];
        const selectedItems = { item1: { id: 'item1', name: 'name1' }, item2: { id: 'item2', name: 'name2' } };

        test('should add items to selectedItems when selectAll is called', () => {
            const wrapper = renderComponent({ items });
            const result = wrapper.instance().selectAll();

            expect(result).toStrictEqual(selectedItems);
        });

        test('should remove items from selectedItems when unselectAll is called', () => {
            const wrapper = renderComponent({ items });
            wrapper.setState({ selectedItems });
            const result = wrapper.instance().unselectAll();

            expect(result).toStrictEqual({});
        });

        test('should call selectAll when handleSelectAllClick and checkbox is not selected', () => {
            const wrapper = renderComponent({ items });
            const instance = wrapper.instance();
            wrapper.setState({ isSelectAllChecked: false });

            instance.selectAll = jest.fn();

            instance.unselectAll = jest.fn();

            instance.handleSelectAllClick();

            expect(wrapper.state('isSelectAllChecked')).toBeTruthy();
            expect(instance.selectAll).toHaveBeenCalledTimes(1);
            expect(instance.unselectAll).toHaveBeenCalledTimes(0);
        });

        test('should call unselectAll when handleSelectAllClick and checkbox is selected', () => {
            const wrapper = renderComponent({ items });
            wrapper.setState({ isSelectAllChecked: true });
            const instance = wrapper.instance();

            instance.selectAll = jest.fn();

            instance.unselectAll = jest.fn();

            instance.handleSelectAllClick();

            expect(wrapper.state('isSelectAllChecked')).toBeFalsy();
            expect(instance.selectAll).toHaveBeenCalledTimes(0);
            expect(instance.unselectAll).toHaveBeenCalledTimes(1);
        });

        test('should not call selectAll or unselectAll when handleSelectAllClick and checkbox is not selected but items are still loading', () => {
            const wrapper = renderComponent({ items: [{ isLoading: true }] });
            wrapper.setState({ isSelectAllChecked: true });
            const instance = wrapper.instance();

            instance.selectAll = jest.fn();

            instance.unselectAll = jest.fn();

            instance.handleSelectAllClick();

            expect(wrapper.state('isSelectAllChecked')).toBeTruthy();
            expect(instance.selectAll).toHaveBeenCalledTimes(0);
            expect(instance.unselectAll).toHaveBeenCalledTimes(0);
        });
    });

    describe('handleIncludeSubfoldersToggle()', () => {
        const items = [
            { id: 'item1', name: 'name1', type: 'folder' },
            { id: 'item2', name: 'name2' },
        ];
        const item1 = { id: 'item1', name: 'name1', type: 'folder' };
        const selectedItems = { item1 };

        test('should only change includeSubfolders value in state if toggle changed and no items should be affected', () => {
            const onIncludeSubfoldersToggle = jest.fn();
            const wrapper = renderComponent({ items, onIncludeSubfoldersToggle });
            const instance = wrapper.instance();

            wrapper.setState({
                includeSubfolders: false,
                selectedItems,
            });

            instance.onIncludeSubfoldersToggle = onIncludeSubfoldersToggle;
            instance.handleIncludeSubfoldersToggle();

            const { includeSubfolders } = instance.state;

            expect(includeSubfolders).toEqual(true);

            expect(instance.onIncludeSubfoldersToggle).toHaveBeenCalledTimes(1);
        });
    });

    describe('numOfSelectedItems()', () => {
        test('should return number of selected items', () => {
            const wrapper = renderComponent({
                items: [
                    { id: 'item3', name: 'name3', type: 'file' },
                    { id: 'item2', name: 'name2', type: 'file' },
                ],
            });

            wrapper.setState({
                selectedItems: { item2: { id: 'item2', name: 'name2' }, item3: { id: 'item3', name: 'name3' } },
            });

            const numOfSelectedItems = wrapper.instance().numOfSelectedItems();

            expect(numOfSelectedItems).toBe(2);
        });
    });

    describe('includeSubfolderToggleDisabled()', () => {
        test('should return true if items are loading', () => {
            const wrapper = renderComponent({
                items: [{ isLoading: true }, { isLoading: true }],
            });

            const includeSubfolderToggleDisabled = wrapper.instance().includeSubfolderToggleDisabled();

            expect(includeSubfolderToggleDisabled).toBe(true);
        });

        test('should return false if the toggle is currently on', () => {
            const wrapper = renderComponent({
                items: [
                    { id: 'item3', name: 'name3', type: 'folder' },
                    { id: 'item2', name: 'name2', type: 'file' },
                ],
            });

            wrapper.setState({
                selectedItems: {
                    item2: { id: 'item2', name: 'name2', type: 'folder' },
                    item3: { id: 'item3', name: 'name3', type: 'file' },
                },
                includeSubfolders: true,
            });

            const includeSubfolderToggleDisabled = wrapper.instance().includeSubfolderToggleDisabled();

            expect(includeSubfolderToggleDisabled).toBe(false);
        });

        test('should return false if there is a selected folder but the current directory we are in has no folders present', () => {
            const wrapper = renderComponent({
                items: [
                    { id: 'item3', name: 'name3', type: 'file' },
                    { id: 'item2', name: 'name2', type: 'file' },
                ],
            });

            wrapper.setState({
                selectedItems: {
                    item2: { id: 'item1', name: 'name1', type: 'folder' },
                },
                includeSubfolders: false,
            });

            const includeSubfolderToggleDisabled = wrapper.instance().includeSubfolderToggleDisabled();

            expect(includeSubfolderToggleDisabled).toBe(false);
        });

        test('should return false if all current items are selected and action disabled', () => {
            const wrapper = renderComponent({
                items: [
                    { id: 'item3', name: 'name3', type: 'file' },
                    { id: 'item2', name: 'name2', type: 'file' },
                ],
            });

            wrapper.setState({
                selectedItems: {
                    item2: { id: 'item1', name: 'name1', type: 'folder' },
                },
            });

            const includeSubfolderToggleDisabled = wrapper.instance().includeSubfolderToggleDisabled();

            expect(includeSubfolderToggleDisabled).toBe(false);
        });

        test('should return true if toggle is off and selected item is not a folder', () => {
            const wrapper = renderComponent({
                items: [
                    { id: 'item3', name: 'name3', type: 'file' },
                    { id: 'item2', name: 'name2', type: 'file' },
                ],
            });

            wrapper.setState({
                selectedItems: {
                    item2: { id: 'item2', name: 'name2', type: 'file' },
                },
                includeSubfolders: false,
            });

            const includeSubfolderToggleDisabled = wrapper.instance().includeSubfolderToggleDisabled();

            expect(includeSubfolderToggleDisabled).toBe(true);
        });

        test('should return true if toggle is off and the number of selected items is more than 1', () => {
            const wrapper = renderComponent({
                items: [
                    { id: 'item3', name: 'name3', type: 'file' },
                    { id: 'item2', name: 'name2', type: 'file' },
                ],
            });

            wrapper.setState({
                selectedItems: {
                    item2: { id: 'item2', name: 'name2', type: 'file' },
                    item1: { id: 'item1', name: 'name1', type: 'folder' },
                },
                includeSubfolders: false,
            });

            const includeSubfolderToggleDisabled = wrapper.instance().includeSubfolderToggleDisabled();

            expect(includeSubfolderToggleDisabled).toBe(true);
        });
    });
});
