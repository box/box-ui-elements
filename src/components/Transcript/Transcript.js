/**
 * @flow
 * @file Transcript component
 * @author Box
 */

import React from 'react';
import { Table, Column } from 'react-virtualized/dist/es/Table';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import 'react-virtualized/styles.css';
import { formatTime } from '../../util/datetime';
import type { SkillData } from '../../flowTypes';
import './Transcript.scss';

type Props = {
    skill: SkillData
};

const cache = new CellMeasurerCache({
    minHeight: 20,
    fixedWidth: true
});

const Transcript = ({ skill: { entries } }: Props) =>
    <AutoSizer disableHeight>
        {({ width }) =>
            <Table
                width={width}
                height={300}
                disableHeader
                headerHeight={0}
                rowHeight={cache.rowHeight}
                rowCount={entries.length}
                rowGetter={({ index }) => entries[index]}
                className='buik-transcript'
                deferredMeasurementCache={cache}
            >
                <Column
                    dataKey='appears'
                    className='buik-transcript-time-column'
                    width={45}
                    flexShrink={0}
                    cellRenderer={({ cellData }): string => {
                        if (Array.isArray(cellData) && !!cellData[0] && typeof cellData[0].start === 'number') {
                            return formatTime(cellData[0].start);
                        }
                        return '--';
                    }}
                />
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
            </Table>}
    </AutoSizer>;

export default Transcript;
