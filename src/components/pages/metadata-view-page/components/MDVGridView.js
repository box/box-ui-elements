// @flow
import * as React from 'react';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import { Column } from 'react-virtualized/dist/es/Table';
import uniqueId from 'lodash/uniqueId';

import BaseTable from '../../../core/table/components/BaseTable';

import MDVGridViewSlot from './MDVGridViewSlot';

import '../styles/MDVGridView.scss';
import '../styles/MDVGridViewSlot.scss';

type TableCellRendererParams = {
    cellData: ?any,
    columnData: ?any,
    dataKey: string,
    parent: Object,
    rowData: any,
    rowIndex: number,
};

type Props = {
    columnCount: number,
    count: number,
    currentCollection: Collection,
    height: number,
    onItemClick: Function,
    onItemSelect: Function,
    slotRenderer: (slotIndex: number) => React.Element<any>,
    width: number,
};

type State = {};

type RowGetterParams = {
    index: number,
};

class GridView extends React.Component<Props, State> {
    cache = new CellMeasurerCache({
        defaultHeight: 300,
        defaultWidth: 400,
        fixedWidth: true,
    });

    componentDidUpdate(prevProps: Props) {
        const { columnCount, width } = this.props;

        // The React Virtualized Table must be notified when either the cached
        // row sizes or the parent width change. If omitted, rows are sized
        // incorrectly resulting in gaps or content overlap.
        if (columnCount !== prevProps.columnCount || width !== prevProps.width) {
            this.cache.clearAll();
            this.forceUpdate();
        }
    }

    cellRenderer = ({ dataKey, parent, rowIndex }: TableCellRendererParams) => {
        const { columnCount, count, currentCollection, slotRenderer, onItemSelect } = this.props;
        const contents = [];

        const startingIndex = rowIndex * columnCount;

        for (let slotIndex = startingIndex; slotIndex < startingIndex + columnCount; slotIndex += 1) {
            // using item's id as key is important for renrendering.  React Virtualized Table rerenders
            // on every 1px scroll, so using improper key would lead to image flickering in each
            // card of the grid view when scrolling.
            let key;
            let item = null;
            if (currentCollection.items && currentCollection.items[slotIndex]) {
                key = currentCollection.items[slotIndex].id;
                item = currentCollection.items[slotIndex];
            } else {
                key = uniqueId('MDVGridViewSlot');
            }

            contents.push(
                <MDVGridViewSlot
                    key={key}
                    slotIndex={slotIndex}
                    slotRenderer={slotIndex < count ? slotRenderer : null}
                    item={item}
                    onItemSelect={onItemSelect}
                />,
            );
        }

        return (
            <CellMeasurer key={dataKey} cache={this.cache} columnIndex={0} parent={parent} rowIndex={rowIndex}>
                <div className="MDVGridView-row">{contents}</div>
            </CellMeasurer>
        );
    };

    rowGetter = ({ index }: RowGetterParams) => {
        return index;
    };

    render() {
        const { columnCount, count, height, width } = this.props;
        const rowCount = Math.ceil(count / columnCount);

        return (
            <BaseTable
                className={`MDVGridView MDVGridView--columns-${columnCount}`}
                deferredMeasurementCache={this.cache}
                disableHeader
                height={height}
                rowCount={rowCount}
                rowGetter={this.rowGetter}
                rowHeight={this.cache.rowHeight}
                width={width}
            >
                <Column cellRenderer={this.cellRenderer} dataKey="" flexGrow={1} width={400} />
            </BaseTable>
        );
    }
}

export default GridView;
