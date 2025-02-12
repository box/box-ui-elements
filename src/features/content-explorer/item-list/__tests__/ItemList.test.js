import * as React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { Column } from '@box/react-virtualized';
import { ItemListBase as ItemList } from '../ItemList';
import ContentExplorerMode from '../../modes';

describe('features/content-explorer/item-list/ItemList', () => {
    const sandbox = sinon.sandbox.create();

    const renderComponent = props =>
        mount(
            <ItemList
                contentExplorerMode={ContentExplorerMode.SELECT_FILE}
                height={500}
                intl={{ formatMessage: () => {} }}
                items={[]}
                numItemsPerPage={100}
                numTotalItems={100}
                onLoadMoreItems={() => {}}
                selectedItems={{}}
                width={500}
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = renderComponent();

            expect(wrapper.find('div.content-explorer-item-list').length).toBe(1);
            expect(wrapper.find('InfiniteLoader').length).toBe(1);
            expect(wrapper.find('Table').length).toBe(1);
        });

        test('should not render infinite loader when onLoadMoreItems is undefined', () => {
            const wrapper = renderComponent({ onLoadMoreItems: undefined });
            expect(wrapper.find('InfiniteLoader').length).toBe(0);
        });

        test('should render component with class when specified', () => {
            const className = 'test';
            const wrapper = renderComponent({ className });

            expect(wrapper.find('div.content-explorer-item-list').hasClass('table')).toBe(true);
            expect(wrapper.find('div.content-explorer-item-list').hasClass(className)).toBe(true);
        });

        test('should render component with correct number of items', () => {
            const items = [
                { id: '1', name: 'item1' },
                { id: '2', name: 'item2' },
                { id: '3', name: 'item3' },
            ];
            const wrapper = renderComponent({ items });

            const rows = wrapper.find('.table-row');
            expect(rows.length).toBe(items.length);
            expect(rows.find('.item-list-name-col .table-cell .item-list-name').length).toBe(items.length);
            expect(rows.find('.item-list-icon-col .table-cell svg').length).toBe(items.length);
        });

        test('should render component with disabled items when specified', () => {
            const items = [
                { id: '1', name: 'item1', isDisabled: false },
                { id: '2', name: 'item2', isDisabled: true },
            ];
            const wrapper = renderComponent({ items });

            const rows = wrapper.find('.table-row');
            rows.forEach((row, i) => {
                expect(row.hasClass('disabled')).toEqual(items[i].isDisabled);
            });
        });

        test('should render component with loading items when specified (loading item does not have id or name)', () => {
            const items = [{ isLoading: false, id: '1', name: 'item1' }, { isLoading: true }];
            const wrapper = renderComponent({ items });

            const rows = wrapper.find('.table-row');
            rows.forEach((row, i) => {
                const loadingPlaceholders = row.find('.item-list-loading-placeholder');
                expect(loadingPlaceholders.length).toEqual(
                    // A placeholder is rendered for each of the list's 3 columns
                    items[i].isLoading ? 3 : 0,
                );
            });
        });

        test('should render component with selected item when specified', () => {
            const items = [
                { id: '1', name: 'item1' },
                { id: '2', name: 'item2' },
                { id: '3', name: 'item3' },
            ];
            const selectedItems = { 1: items[0] };
            const wrapper = renderComponent({
                items,
                selectedItems,
            });

            const rows = wrapper.find('.table-row');
            rows.forEach((row, i) => {
                const isSelected = i === 0;
                expect(row.hasClass('is-selected')).toEqual(isSelected);
                expect(row.find('RadioButton').prop('isSelected')).toEqual(isSelected);
            });
        });

        test('should render items with test ids for e2e testing', () => {
            const items = [
                { id: 'item1', name: 'item1' },
                { id: 'item2', name: 'item2' },
            ];
            const expectedTestId = ['item-row-item1', 'item-row-item2'];
            const wrapper = renderComponent({ items });

            const testIds = wrapper.find('[role="row"][data-testid*="item-row-"]').map(row => row.prop('data-testid'));
            expect(testIds).toEqual(expectedTestId);
        });

        test('should render component with default item buttons', () => {
            const items = [
                { id: '1', name: 'item1' },
                { id: '2', name: 'item2' },
            ];
            const wrapper = renderComponent({ items });

            expect(wrapper.find('.item-list-button-col RadioButton').length).toBe(items.length);
        });

        test('should pass width and height props through to Table', () => {
            const width = 111;
            const height = 222;
            const wrapper = renderComponent({
                width,
                height,
            });

            const table = wrapper.find('Table');
            expect(table.prop('width')).toEqual(width);
            expect(table.prop('height')).toEqual(height);
        });
    });

    describe('onItemClick', () => {
        test('should call onItemClick when item is clicked', () => {
            const items = [{ id: '1', name: 'item1' }];
            const onItemClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                items,
                onItemClick: onItemClickSpy,
            });

            wrapper.find('.table-row').simulate('click');

            expect(onItemClickSpy.calledOnce).toBe(true);
        });
    });

    describe('onItemDoubleClick', () => {
        test('should call onItemDoubleClick when item is double clicked', () => {
            const items = [{ id: '1', name: 'item1' }];
            const onItemDoubleClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                items,
                onItemDoubleClick: onItemDoubleClickSpy,
            });

            wrapper.find('.table-row').simulate('doubleClick');

            expect(onItemDoubleClickSpy.calledOnce).toBe(true);
        });
    });

    describe('onItemNameClick', () => {
        test('should call onItemNameClick when item name is clicked', () => {
            const items = [{ id: '1', name: 'item1', type: 'folder' }];
            const onItemNameClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                items,
                onItemNameClick: onItemNameClickSpy,
            });

            wrapper.find('.item-list-name').hostNodes().simulate('click');

            expect(onItemNameClickSpy.calledOnce).toBe(true);
        });
    });

    describe('itemIconRenderer', () => {
        test('should use itemIconRenderer when specified', () => {
            const items = [
                { id: '1', name: 'item1' },
                { id: '2', name: 'item2' },
            ];
            const itemIconRenderer = () => <button type="button" className="icon-test" />;
            const wrapper = renderComponent({
                items,
                itemIconRenderer,
            });

            expect(wrapper.find('.item-list-icon-col button.icon-test').length).toBe(items.length);
        });
    });

    describe('itemButtonRenderer', () => {
        test('should use itemButtonRenderer when specified', () => {
            const items = [
                { id: '1', name: 'item1' },
                { id: '2', name: 'item2' },
            ];
            const itemButtonRenderer = () => <button type="button" className="button-test" />;
            const wrapper = renderComponent({
                items,
                itemButtonRenderer,
            });

            expect(wrapper.find('.item-list-button-col button.button-test').length).toBe(items.length);
        });
    });

    describe('itemRowRenderer', () => {
        test('should use defaultTableRowRenderer when itemRowRenderer is not provided', () => {
            const items = [
                { id: '1', name: 'item1' },
                { id: '2', name: 'item2' },
            ];
            const wrapper = renderComponent({
                items,
            });

            expect(wrapper.find('Grid [role="row"].ReactVirtualized__Table__row').length).toBe(items.length);
        });

        test('should use itemRowRenderer when specified', () => {
            const items = [
                { id: '1', name: 'item1' },
                { id: '2', name: 'item2' },
            ];
            const itemRowRenderer = params => <div key={params.index} className="row-test" />;
            const wrapper = renderComponent({
                items,
                itemRowRenderer,
            });

            expect(wrapper.find('Grid .row-test').length).toBe(items.length);
        });
    });

    describe('noItemsRenderer', () => {
        test('should use noItemsRenderer when no items are specified', () => {
            const emptyText = 'Empty';
            const noItemsRenderer = () => <h1>{emptyText}</h1>;
            const wrapper = renderComponent({
                items: [],
                noItemsRenderer,
            });

            expect(wrapper.find('h1').text()).toEqual(emptyText);
        });
    });

    describe('additionalColumns', () => {
        test('should render extra column', () => {
            const items = [
                { id: '1', name: 'item1' },
                { id: '2', name: 'item2' },
                { id: '3', name: 'item3' },
            ];

            const additionalColumns = [
                <Column
                    key="accessLevel"
                    className="item-list-accessLevel-col"
                    dataKey="accessLevel"
                    flexGrow={1}
                    flexShrink={0}
                    width={0}
                />,
            ];
            const wrapper = renderComponent({ items, additionalColumns });
            expect(wrapper.find('.item-list-accessLevel-col').length).toBe(3);
        });
    });

    describe('headerHeight', () => {
        const items = [{ id: '1', name: 'item1' }];
        test('should display header row with specified height when item list is not empty', () => {
            const headerHeight = 30;
            const wrapper = renderComponent({
                headerHeight,
                items,
            });

            const header = wrapper.find('.ReactVirtualized__Table__headerRow');
            expect(header.props().style.height).toBe(headerHeight);
        });

        test('should not display header row with specified height when item list is empty and noItemsRenderer is present', () => {
            const headerHeight = 30;
            const noItemsRenderer = () => <></>;
            const wrapper = renderComponent({
                headerHeight,
                noItemsRenderer,
            });

            const header = wrapper.find('.ReactVirtualized__Table__headerRow');
            expect(header.props().style.height).not.toBe(headerHeight);
        });
    });

    describe('headerRenderer', () => {
        const items = [{ id: '1', name: 'item1' }];
        test('should use headerRenderer when specified if item list is not empty', () => {
            const wrapper = renderComponent({
                headerRenderer: () => <div data-testid="customHeader">Custom Header</div>,
                items,
            });
            const headerRow = wrapper.find("[data-testid='customHeader']");
            expect(headerRow.length).toBe(1);
        });

        test('should not use headerRenderer when specified if item list is empty and noItemsRenderer is present', () => {
            const noItemsRenderer = () => <></>;
            const wrapper = renderComponent({
                headerRenderer: () => <div data-testid="customHeader">Custom Header</div>,
                noItemsRenderer,
            });
            const headerRow = wrapper.find("[data-testid='customHeader']");
            expect(headerRow.length).not.toBe(1);
        });
    });

    describe('infinite scroll', () => {
        test.each([
            // threshold item is (nLoadedItems - numItemsPerPage)th item
            {
                description:
                    'should call onLoadMoreItems initially when threshold item is visible and there are loading items',
                nLoadedItems: 100,
                nLoadingItems: 10,
                numItemsPerPage: 100,
                expectedCallCount: 1,
            },
            {
                description: 'should not call onLoadMoreItems initially when threshold item is not visible',
                nLoadedItems: 100,
                nLoadingItems: 10,
                numItemsPerPage: 10,
                expectedCallCount: 0,
            },
            {
                description: 'should not call onLoadMoreItems initially when there are no loading items',
                nLoadedItems: 100,
                nLoadingItems: 0,
                numItemsPerPage: 10,
                expectedCallCount: 0,
            },
        ])('$description', ({ nLoadedItems, nLoadingItems, numItemsPerPage, expectedCallCount }) => {
            const onLoadMoreItemsSpy = sandbox.spy();
            const items = [
                ...Array.from({ length: nLoadedItems }, () => ({ isLoading: false })),
                ...Array.from({ length: nLoadingItems }, () => ({ isLoading: true })),
            ];

            renderComponent({
                onLoadMoreItems: onLoadMoreItemsSpy,
                items,
                numItemsPerPage,
                numTotalItems: items.length,
            });

            expect(onLoadMoreItemsSpy.callCount).toBe(expectedCallCount);
        });
    });
});
