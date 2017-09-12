/**
 * @flow
 * @file Transcript component
 * @author Box
 */

import React from 'react';
import { Table, Column } from 'react-virtualized/dist/es/Table';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import 'react-virtualized/styles.css';
import type { Card } from '../../flowTypes';
import './Transcript.scss';

type Props = {
    card: Card
};

const cache = new CellMeasurerCache({
    minHeight: 20,
    fixedWidth: true
});

const Transcript = ({ card: { entries } }: Props) =>
    <Table
        width={280}
        height={300}
        disableHeader
        headerHeight={0}
        rowHeight={cache.rowHeight}
        rowCount={entries.length}
        rowGetter={({ index }) => entries[index]}
        className='buik-transcript'
        deferredMeasurementCache={cache}
    >
        <Column dataKey='appears' width={35} flexShrink={0} cellRenderer={({ cellData }) => cellData[0].start} />
        <Column
            dataKey='text'
            width={245}
            flexGrow={1}
            cellRenderer={({ dataKey, parent, rowIndex, cellData }) =>
                <CellMeasurer cache={cache} columnIndex={0} key={dataKey} parent={parent} rowIndex={rowIndex}>
                    <div
                        className='buik-transcript-column'
                        style={{
                            whiteSpace: 'normal'
                        }}
                    >
                        {cellData}
                    </div>
                </CellMeasurer>}
        />
    </Table>;

export default Transcript;
