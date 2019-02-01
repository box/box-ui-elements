import * as React from 'react';

import {
    metadataViewProps,
    instances,
    template,
    visibleColumns,
    expectedVisibleColumns,
    visibleColumnsOneHidden,
    expectedVisibleColumnsOneHidden,
    metadataTableStateAfterMount,
    expectedColumnsChangedWidths,
    expectedResizeRowWidths,
} from '../fixtures';
import { MetadataTable } from '../MetadataViewTable';

const { totalWidth, tableHeight, tableHeaderHeight, tableRowHeight, widths } = metadataViewProps;

const instance = { instances };

const items = instance.instances.map(i => i.data);

describe('features/metadata-view/components/MetadataViewTable', () => {
    const stateAfterMount = metadataTableStateAfterMount;

    const getWrapper = () => {
        return shallow(
            <MetadataTable
                columns={visibleColumns}
                columnWidths={widths}
                height={100}
                items={items}
                tableHeaderHeight={tableHeaderHeight}
                tableHeight={tableHeight}
                tableRowHeight={tableRowHeight}
                template={template}
                totalWidth={totalWidth}
                width={100}
            />,
        );
    };

    describe('Render', () => {
        test('should match render', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('getDerivedStateFromProps', () => {
        test('should correctly get all 8 visible columns and equally calculated widths on initial render', () => {
            const wrapper = getWrapper();

            const nextProps = {
                columnWidths: widths,
                items,
                tableRowHeight,
                tableHeaderHeight,
                tableHeight,
                template,
                totalWidth,
                columns: visibleColumns,
            };

            const prevState = {
                visibleColumns: [],
                widths: {},
            };

            const derivedStateFromProps = wrapper.instance().constructor.getDerivedStateFromProps(nextProps, prevState);
            expect(derivedStateFromProps).toEqual(stateAfterMount);
        });

        test('if any columns were not hidden or rearranged it should return an empty object, ', () => {
            const wrapper = getWrapper();

            const nextProps = {
                columnWidths: widths,
                items,
                tableRowHeight,
                tableHeaderHeight,
                tableHeight,
                template,
                totalWidth,
                columns: visibleColumns,
            };

            const prevState = {
                visibleColumns: stateAfterMount.visibleColumns,
                widths: {},
            };
            const derivedStateFromProps = wrapper.instance().constructor.getDerivedStateFromProps(nextProps, prevState);
            expect(derivedStateFromProps).toEqual(null);
        });

        test('if the number of columns changed it should recalculate the width dependent on the number of columns', () => {
            const wrapper = getWrapper();

            const nextProps = {
                columnWidths: widths,
                items,
                tableRowHeight,
                tableHeaderHeight,
                tableHeight,
                template,
                totalWidth,
                columns: visibleColumnsOneHidden,
            };

            const prevState = {
                visibleColumns: stateAfterMount.visibleColumns,
                widths: {},
            };

            const expected = {
                visibleColumns: expectedVisibleColumnsOneHidden.visibleColumns,
                widths: expectedColumnsChangedWidths,
            };
            const derivedStateFromProps = wrapper.instance().constructor.getDerivedStateFromProps(nextProps, prevState);
            expect(derivedStateFromProps).toEqual(expected);
        });
    });

    describe('renderOptionalColumns()', () => {
        test('should have a length of 8', () => {
            const wrapper = getWrapper();
            wrapper.setState({
                visibleColumns: stateAfterMount.visibleColumns,
            });
            const optionalColumns = wrapper.instance().renderOptionalColumns();
            expect(optionalColumns).toBeTruthy();
            expect(optionalColumns).toHaveLength(8);
        });

        test('render', () => {
            const wrapper = getWrapper();
            const renderOptionalColumns = wrapper.instance().renderOptionalColumns();
            expect(renderOptionalColumns).toMatchSnapshot();
        });
    });

    // describe('getPreviousColumn()', () => {
    //     test('should return the column next to contract value', () => {
    //         const wrapper = getWrapper();
    //         const previousColumn = wrapper.instance().getPreviousColumn('contract value');
    //         wrapper.setState({
    //             visibleColumns: stateAfterMount.visibleColumns,
    //         });

    //         expect(previousColumn).toEqual(undefined);
    //     });
    // });

    describe('resizeRows()', () => {
        test('After resize rows is called state should be updated accordingly', () => {
            const wrapper = getWrapper();
            wrapper.setState(stateAfterMount);
            wrapper.instance().resizeRow({ dataKey: 'contract value', deltaX: 0.3345621234 });
            const expected = {
                visibleColumns: expectedVisibleColumns.visibleColumns,
                widths: expectedResizeRowWidths,
            };
            expect(wrapper.state()).toEqual(expected);
        });

        test('if widths is empty it should return an empty object', () => {
            const wrapper = getWrapper();
            wrapper.setState({
                visibleColumns: stateAfterMount.visibleColumns,
                widths: {},
            });
            wrapper.instance().resizeRow({ dataKey: 'contract value', deltaX: 0.3345621234 });
            const expected = {
                visibleColumns: expectedVisibleColumns.visibleColumns,
                widths: {},
            };
            expect(wrapper.state()).toEqual(expected);
        });
    });
});
