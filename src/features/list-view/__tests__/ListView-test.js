// @flow
import * as React from 'react';

import ListView from '../ListView';
// Global Declarations

const nameCellStyle = { height: 50, left: 0, position: 'absolute', top: 0, width: 300 };

type Props = {|
    className: string,
    key: string,
    name: string,
|};

const ListViewNameTestCell = ({ name }: Props) => <div>{name}</div>;

const rowData = [
    [
        '',
        <ListViewNameTestCell name="A" key="A" style={nameCellStyle} />,
        <ListViewNameTestCell name="B" key="B" style={nameCellStyle} />,
        <ListViewNameTestCell name="C" key="C" style={nameCellStyle} />,
    ],
    ['', 'D', 'E', 'F'],
];

const getGridHeader = columnIndex => ['h1', 'h2'][columnIndex];

const getGridCell = ({ columnIndex, rowIndex }) => rowData[columnIndex][rowIndex];

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
            columnIndex | rowIndex | cellData                      | should                                                  | className
            ${0}        | ${0}     | ${'h1'}                       | ${'returns h1 when columnIndex is 0 and rowIndex is 0'} | ${'list-view-column-header'}
            ${0}        | ${1}     | ${'<ListViewNameTestCell />'} | ${'returns A when columnIndex is 0 and rowIndex is 1'}  | ${'list-view-name-cell'}
            ${0}        | ${2}     | ${'<ListViewNameTestCell />'} | ${'returns B when columnIndex is 0 and rowIndex is 2'}  | ${'list-view-name-cell'}
            ${0}        | ${3}     | ${'<ListViewNameTestCell />'} | ${'returns C when columnIndex is 0 and rowIndex is 3'}  | ${'list-view-name-cell'}
            ${1}        | ${0}     | ${'h2'}                       | ${'returns h2 when columnIndex is 1 and rowIndex is 0'} | ${'list-view-column-header'}
            ${1}        | ${1}     | ${'D'}                        | ${'returns A when columnIndex is 0 and rowIndex is 1'}  | ${'list-view-column-cell'}
            ${1}        | ${2}     | ${'E'}                        | ${'returns B when columnIndex is 0 and rowIndex is 2'}  | ${'list-view-column-cell'}
            ${1}        | ${3}     | ${'F'}                        | ${'returns C when columnIndex is 0 and rowIndex is 3'}  | ${'list-view-column-cell'}
        `('$should', ({ columnIndex, rowIndex, cellData, className }) => {
            const wrapper = getWrapper();

            const cell = wrapper.instance().cellRenderer({
                columnIndex,
                key: 'heh',
                rowIndex,
            });

            const testCell = shallow(cell);

            expect(testCell.text()).toEqual(cellData);

            expect(testCell.hasClass(className)).toBeTruthy();
        });
    });

    describe('getColumnWidth()', () => {
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
