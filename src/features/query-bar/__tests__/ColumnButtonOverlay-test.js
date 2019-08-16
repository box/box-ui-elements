import * as React from 'react';

import { columnForDateType, columnWithFloatType } from '../components/fixtures';
import ColumnButtonOverlay from '../components/ColumnButtonOverlay';

const columns = [columnForDateType, columnWithFloatType];

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
                updatedColumns: [columnWithFloatType, columnForDateType],
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
        test('Should update state with pendingColumns', () => {
            const pendingColumns = columns;

            const wrapper = getWrapper();
            wrapper.setState({
                pendingColumns,
            });

            wrapper.instance().updatePendingColumns(columnForDateType);

            expect(wrapper.state('pendingColumns')[0].isShown).toBeFalsy();
            expect(wrapper.state('pendingColumns')[1].isShown).toBeTruthy();
        });
    });
});
