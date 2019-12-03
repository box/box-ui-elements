// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { WindowScroller } from 'react-virtualized/dist/es/WindowScroller';
import { Column, Table } from 'react-virtualized/dist/es/Table';

import BaseVirtualizedTable from '../BaseVirtualizedTable';
import VirtualizedTable from '../VirtualizedTable';

describe('features/virtualized-table/VirtualizedTable', () => {
    let wrapper;
    let rowData;

    const getWrapper = (props = {}) => {
        return shallow(
            <VirtualizedTable {...props}>
                <Column dataKey="name" label="Name" width={100} />
                <Column dataKey="description" label="Description" width={100} />
            </VirtualizedTable>,
            { disableLifecycleMethods: true },
        );
    };

    beforeEach(() => {
        rowData = [
            {
                name: 'name1',
                description: 'description1',
            },
            {
                name: 'name2',
                description: 'description2',
            },
            {
                name: 'name3',
                description: 'description3',
            },
        ];
        wrapper = getWrapper({ rowData });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should successfully render a VirtualizedTable', () => {
        const autosizer = wrapper.dive().find(AutoSizer);
        const windowScroller = autosizer.dive().find(WindowScroller);
        const baseTable = windowScroller.dive().find(BaseVirtualizedTable);
        const table = baseTable.dive().find(Table);

        expect(wrapper).toMatchSnapshot();
        expect(autosizer).toMatchSnapshot();
        expect(windowScroller).toMatchSnapshot();
        expect(table).toMatchSnapshot();
    });

    test('should successfully render a VirtualizedTable with fixed height', () => {
        wrapper.setProps({ height: 10 });

        const autosizer = wrapper.dive().find(AutoSizer);
        const baseTable = autosizer.dive().find(BaseVirtualizedTable);
        const table = baseTable.dive().find(Table);

        expect(autosizer).toMatchSnapshot();
        expect(table).toMatchSnapshot();
    });

    test('should get row data object that corresponds to row index', () => {
        const table = wrapper
            .dive()
            .find(AutoSizer)
            .dive()
            .find(WindowScroller)
            .dive()
            .find(BaseVirtualizedTable)
            .dive()
            .find(Table);

        expect(table.props().rowGetter({ index: 0 })).toEqual(rowData[0]);
        expect(table.props().rowGetter({ index: 1 })).toEqual(rowData[1]);
        expect(table.props().rowGetter({ index: 2 })).toEqual(rowData[2]);
    });

    test('should set correct rowCount', () => {
        const table = wrapper
            .dive()
            .find(AutoSizer)
            .dive()
            .find(WindowScroller)
            .dive()
            .find(BaseVirtualizedTable)
            .dive()
            .find(Table);

        expect(table.props().rowCount).toEqual(rowData.length);
    });

    test('should not render WindowScroller when height is set', () => {
        expect(
            wrapper
                .dive()
                .find(AutoSizer)
                .dive()
                .find(WindowScroller),
        ).toHaveLength(1);

        wrapper.setProps({ height: 10 });

        expect(
            wrapper
                .dive()
                .find(AutoSizer)
                .dive()
                .find(WindowScroller),
        ).toHaveLength(0);
        expect(
            wrapper
                .dive()
                .find(AutoSizer)
                .dive()
                .find(BaseVirtualizedTable)
                .props().height,
        ).toBe(10);
    });

    test('should set defaultHeight and disableHeight on AutoSizer when height is set', () => {
        expect(
            wrapper
                .dive()
                .find(AutoSizer)
                .props(),
        ).toEqual(
            expect.objectContaining({
                defaultHeight: undefined,
                disableHeight: true,
            }),
        );

        wrapper.setProps({ height: 10 });

        expect(
            wrapper
                .dive()
                .find(AutoSizer)
                .props(),
        ).toEqual(
            expect.objectContaining({
                defaultHeight: 10,
                disableHeight: true,
            }),
        );
    });
});
