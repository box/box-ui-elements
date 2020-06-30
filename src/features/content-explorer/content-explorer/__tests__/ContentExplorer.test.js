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
        });
    });
});
