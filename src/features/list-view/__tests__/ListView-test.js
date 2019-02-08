import * as React from 'react';

import ListView from '../ListView';

// Global Declarations
const rowData = [['', 'A', 'B', 'C'], ['', 'D', 'E', 'F']];

const getGridHeader = columnIndex => ['h1', 'h2'][columnIndex];

const getGridCell = ({ columnIndex, rowIndex }) => rowData[columnIndex][rowIndex];

describe('features/list-view/ListView', () => {
    const getWrapper = props => {
        return shallow(
            <ListView
                columnCount={2}
                getGridCell={getGridCell}
                getGridHeader={getGridHeader}
                getColumnWidth={jest.fn()}
                height={100}
                rowCount={2}
                width={100}
                {...props}
            />,
        );
    };
    describe('getGridCellData Methods', () => {
        test.each`
            columnIndex | rowIndex | cellData | should
            ${0}        | ${0}     | ${'h1'}  | ${'returns h1 when columnIndex is 0 and rowIndex is 0'}
            ${1}        | ${0}     | ${'h2'}  | ${'returns h2 when columnIndex is 1 and rowIndex is 0'}
            ${0}        | ${1}     | ${'A'}   | ${'returns A when columnIndex is 0 and rowIndex is 1'}
            ${0}        | ${2}     | ${'B'}   | ${'returns B when columnIndex is 0 and rowIndex is 2'}
            ${0}        | ${3}     | ${'C'}   | ${'returns C when columnIndex is 0 and rowIndex is 3'}
        `('$should', ({ columnIndex, rowIndex, cellData }) => {
            const wrapper = getWrapper();
            const cell = wrapper.instance().cellRenderer({
                columnIndex,
                key: 'heh',
                rowIndex,
            });

            // if rowIndex is zero that means its a Header Column
            if (rowIndex === 0) {
                expect(shallow(cell).html()).toEqual(`<div class="item-list-column-header">${cellData}</div>`);
            } else if (columnIndex === 0) {
                expect(shallow(cell).html()).toEqual(`<div class="item-list-name-cell">${cellData}</div>`);
            } else {
                expect(shallow(cell).html()).toEqual(`<div class="item-list-column-cell">${cellData}</div>`);
            }
        });
    });

    describe('Snapshot test', () => {
        test('Should return a snapshot of the ListView component', () => {
            // ListView uses a React Virtualized MultiGrid, which is a wrapper around 4 grid components, shallow returns nothing useful, which is why we are using mount to see the actual data in the snapshot.
            const wrapper = mount(
                <ListView
                    columnCount={4}
                    getGridCell={getGridCell}
                    getGridHeader={getGridHeader}
                    getColumnWidth={jest.fn()}
                    height={100}
                    rowCount={4}
                    width={100}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });
    });
});
