// @flow
import * as React from 'react';

import ListView from '../ListView';
import { DEFAULT_COLUMN_WIDTH } from '../constants';
// Global Declarations

// Define a matrix with 2 columns and 3 rows.
const gridData = [['A', 'B', 'C'], ['D', 'E', 'F']];

const getGridHeader = columnIndex => ['h1', 'h2'][columnIndex];

// const getGridHeaderSort = columnIndex => [SORT_ORDER_ASCENDING, null][columnIndex];

const getGridCell = ({ columnIndex, rowIndex }) => gridData[columnIndex][rowIndex];

describe('features/list-view/ListView', () => {
    const getWrapper = props => {
        return shallow(
            <ListView
                columnCount={2}
                getGridCell={getGridCell}
                getGridHeader={getGridHeader}
                height={100}
                rowCount={2}
                width={100}
                {...props}
            />,
        );
    };

    describe('computeColumnWidth()', () => {
        describe('when props.getColumnWidth is included', () => {
            test('should delegate to props.getColumnWidth', () => {
                const getColumnWidth = columnIndex => [150, 250][columnIndex];

                const wrapper = getWrapper({
                    getColumnWidth,
                    width: 100,
                });

                expect(wrapper.instance().computeColumnWidth({ index: 0 })).toBe(150);
                expect(wrapper.instance().computeColumnWidth({ index: 1 })).toBe(250);
            });

            test('should ignore props.getColumnWidth and stretch column widths', () => {
                const getColumnWidth = columnIndex => [150, 250][columnIndex];

                const wrapper = getWrapper({
                    getColumnWidth,
                    width: 1000,
                });

                expect(wrapper.instance().computeColumnWidth({ index: 0 })).toBe(150);
                expect(wrapper.instance().computeColumnWidth({ index: 1 })).toBe(1000 - 150);
            });
        });

        describe('when props.getColumnWidth is excluded', () => {
            test('should return default column width', () => {
                const wrapper = getWrapper({
                    width: 100,
                });

                expect(wrapper.instance().computeColumnWidth({ index: 0 })).toBe(DEFAULT_COLUMN_WIDTH);
                expect(wrapper.instance().computeColumnWidth({ index: 1 })).toBe(DEFAULT_COLUMN_WIDTH);
            });

            test('should stretch column widths', () => {
                const wrapper = getWrapper({
                    width: 1000,
                });

                expect(wrapper.instance().computeColumnWidth({ index: 0 })).toBe(DEFAULT_COLUMN_WIDTH);
                expect(wrapper.instance().computeColumnWidth({ index: 1 })).toBe(1000 - DEFAULT_COLUMN_WIDTH);
            });
        });
    });

    describe('props.getColumnWidth()', () => {
        const getColumnWidth = columnIndex => [100, 500][columnIndex];

        const wrapper = getWrapper({ getColumnWidth });

        const wrapperProps = wrapper.instance().props;

        test('should return 100 if the index is even', () => {
            const width = wrapperProps.getColumnWidth(0);
            expect(width).toEqual(100);
        });

        test('should return 500 if the index is odd', () => {
            const width = wrapperProps.getColumnWidth(1);
            expect(width).toEqual(500);
        });
    });
});
