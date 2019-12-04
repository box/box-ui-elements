// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { Column, Table } from 'react-virtualized/dist/es/Table';

import BaseVirtualizedTable from '../BaseVirtualizedTable';
import loadingRowRenderer from '../../virtualized-table-renderers/loadingRowRenderer';

describe('features/virtualized-table/BaseVirtualizedTable', () => {
    let wrapper;
    let rowData;

    const getWrapper = (props = {}) => {
        return shallow(
            <BaseVirtualizedTable className="className" height={50} sort={jest.fn()} width={100} {...props}>
                <Column dataKey="name" label="Name" width={100} />
                <Column dataKey="description" label="Description" width={100} />
            </BaseVirtualizedTable>,
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

    test('should successfully render a BaseVirtualizedTable', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('should render empty rule data with default row count when isLoading is set to true', () => {
        wrapper.setProps({ isLoading: true });

        expect(wrapper.find(Table).prop('rowCount')).toBe(50);
    });

    test('should render empty rule data with row count when isLoading is set to true and loadingRowCount is provided', () => {
        wrapper.setProps({ isLoading: true, loadingRowCount: 12 });

        expect(wrapper.find(Table).prop('rowCount')).toBe(12);
    });

    test('should blur current target and call sort prop with sortParams when sort click is triggered', () => {
        const event = {
            currentTarget: {
                blur: jest.fn(),
            },
            type: 'keydown',
        };
        const sort = jest.fn();
        const sortParams = { event };

        wrapper.setProps({ sort });
        const table = wrapper.find(Table);

        table.props().sort(sortParams);
        expect(event.currentTarget.blur).toHaveBeenCalledTimes(0);
        expect(sort).toHaveBeenCalledTimes(1);

        event.type = 'click';
        table.props().sort(sortParams);
        expect(event.currentTarget.blur).toHaveBeenCalledTimes(1);
        expect(sort).toHaveBeenCalledTimes(2);
    });

    test('should have loadingRowRender if loading is set to true', () => {
        const rowRendererMock = jest.fn();

        wrapper.setProps({ isLoading: false, rowRenderer: rowRendererMock });
        expect(wrapper.find(Table).prop('rowRenderer')).toBe(rowRendererMock);

        wrapper.setProps({ isLoading: true });
        expect(wrapper.find(Table).prop('rowRenderer')).toBe(loadingRowRenderer);
    });

    test('should use rowGetter when provided', () => {
        let tableRow;
        const rowGetter = jest.fn().mockReturnValue('custom row');

        wrapper.setProps({ rowGetter: null });
        tableRow = wrapper
            .find(Table)
            .props()
            .rowGetter({ index: 1 });
        expect(tableRow).toEqual(rowData[1]);

        wrapper.setProps({ rowGetter });
        tableRow = wrapper
            .find(Table)
            .props()
            .rowGetter({ index: 1 });
        expect(tableRow).toBe('custom row');
    });
});
