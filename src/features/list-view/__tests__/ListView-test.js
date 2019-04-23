// @flow
import * as React from 'react';

import ListView from '../ListView';
import { DEFAULT_COLUMN_WIDTH } from '../constants';
import { SORT_ORDER_ASCENDING } from '../../query-bar/constants';
// Global Declarations

// Define a matrix with 2 columns and 3 rows.
const gridData = [['A', 'B', 'C'], ['D', 'E', 'F']];

const getGridHeader = columnIndex => ['h1', 'h2'][columnIndex];

const getGridHeaderSort = columnIndex => [SORT_ORDER_ASCENDING, null][columnIndex];

const getGridCell = ({ columnIndex, cellIndex }) => gridData[columnIndex][cellIndex];

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
    describe('CellRenderer()', () => {
        test.each`
            columnIndex | rowIndex | cellData | should                                                  | className
            ${0}        | ${0}     | ${'h1'}  | ${'returns h1 when columnIndex is 0 and rowIndex is 0'} | ${'bdl-ListView-columnHeader'}
            ${1}        | ${0}     | ${'h2'}  | ${'returns h2 when columnIndex is 1 and rowIndex is 0'} | ${'bdl-ListView-columnHeader'}
        `('$should', ({ columnIndex, rowIndex, cellData, className }) => {
            const wrapper = getWrapper();

            const cell = wrapper.instance().cellRenderer({
                columnIndex,
                key: 'heh',
                rowIndex,
            });

            expect(cell.props.children[0]).toBe(cellData);
            expect(cell.props.className).toBe(className);
        });

        test.each`
            columnIndex | rowIndex | cellData | should
            ${0}        | ${1}     | ${'A'}   | ${'returns A when columnIndex is 0 and rowIndex is 1'}
            ${0}        | ${2}     | ${'B'}   | ${'returns B when columnIndex is 0 and rowIndex is 2'}
            ${0}        | ${3}     | ${'C'}   | ${'returns C when columnIndex is 0 and rowIndex is 3'}
            ${1}        | ${1}     | ${'D'}   | ${'returns A when columnIndex is 0 and rowIndex is 1'}
            ${1}        | ${2}     | ${'E'}   | ${'returns B when columnIndex is 0 and rowIndex is 2'}
            ${1}        | ${3}     | ${'F'}   | ${'returns C when columnIndex is 0 and rowIndex is 3'}
        `('$should', ({ columnIndex, rowIndex, cellData }) => {
            const wrapper = getWrapper();

            const cell = wrapper.instance().cellRenderer({
                columnIndex,
                key: 'heh',
                rowIndex,
            });

            expect(cell).toBe(cellData);
        });

        test.each`
            columnIndex | rowIndex | cellData                   | should                                                                                                        | className
            ${0}        | ${0}     | ${'h1<IconSortChevron />'} | ${'returns h1<IconSortChevron /> when columnIndex is 0 and rowIndex is 0 and getGridHeaderSort is passed in'} | ${'.bdl-icon-sort-chevron.bdl-ListView-isSortAsc'}
            ${1}        | ${0}     | ${'h2'}                    | ${'returns h2 when columnIndex is 1 and rowIndex is 0 and getGridHeaderSort is passed in'}                    | ${'.bdl-icon-short-chevron'}
        `('$should', ({ columnIndex, rowIndex, cellData, className }) => {
            const wrapper = getWrapper({
                getGridHeaderSort,
            });

            const cell = wrapper.instance().cellRenderer({
                columnIndex,
                key: 'heh',
                rowIndex,
            });

            const testCell = shallow(cell);
            expect(testCell.text()).toEqual(cellData);
            expect(testCell.find(className)).toBeTruthy();
        });
    });

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
