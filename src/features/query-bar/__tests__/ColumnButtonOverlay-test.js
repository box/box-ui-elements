import * as React from 'react';

import { columns, columnsWithNewOrder, columnsWithOneColumnNotShown } from '../components/fixtures';
import ColumnButtonOverlay from '../components/ColumnButtonOverlay';

describe('features/query-bar/components/ColumnButtonOverlay', () => {
    const getWrapper = (props = {}) => {
        return shallow(<ColumnButtonOverlay onColumnChange={jest.fn()} columns={columns} {...props} />);
    };

    describe('render', () => {
        test('should render ColumnButtonOverlay default state', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('onDragEnd()', () => {
        [
            {
                description: 'Should update state with new ordering',
                sourceIndex: 0,
                destinationIndex: 1,
                updatedColumns: columnsWithNewOrder,
            },
            {
                description: 'Should not update state due to no destinationIndex',
                sourceIndex: 0,
                updatedColumns: columns,
            },
        ].forEach(({ description, sourceIndex, destinationIndex, updatedColumns }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().onDragEnd(sourceIndex, destinationIndex);

                expect(wrapper.state('pendingColumns')).toEqual(updatedColumns);
            });
        });
    });

    describe('applyFilters()', () => {
        [
            {
                description: 'Should apply filters to parent state',
                pendingColumns: columns,
            },
        ].forEach(({ description, pendingColumns }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();

                wrapper.setState({
                    pendingColumns,
                });
                wrapper.instance().applyFilters();
            });
        });
    });

    describe('updatePendingColumns()', () => {
        [
            {
                description: 'Should update state with pendingColumns',
                numberOfHiddenColumns: 0,
                column: {
                    displayName: 'Hullo Thar',
                    id: '1',
                    isShown: true,
                    property: 'name',
                    source: 'item',
                    type: 'string',
                },
                pendingColumns: columns,
                updatedPendingColumns: columnsWithOneColumnNotShown,
            },
        ].forEach(({ description, column, pendingColumns, updatedPendingColumns }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.setState({
                    pendingColumns,
                });

                wrapper.instance().updatePendingColumns(column);

                expect(wrapper.state('pendingColumns')).toEqual(updatedPendingColumns);
            });
        });
    });
});
