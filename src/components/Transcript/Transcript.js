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
import type { SkillData, TimeSlice, SkillDataEntry } from '../../flowTypes';
import './Transcript.scss';

type Props = {
    skill: SkillData,
    getPreviewer?: Function
};

const cache = new CellMeasurerCache({
    minHeight: 10,
    fixedWidth: true
});

const isValidStartTime = (cellData?: TimeSlice[]): boolean =>
    Array.isArray(cellData) && !!cellData[0] && typeof cellData[0].start === 'number';

const Transcript = ({ skill: { entries }, getPreviewer }: Props) =>
    entries.length === 1 && !isValidStartTime(entries[0].appears)
        ? <span className='buik-transcript'>
            {entries[0].text}
        </span>
        : <AutoSizer disableHeight>
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
                    onRowClick={({ rowData }: { rowData: SkillDataEntry }): void => {
                        const viewer = getPreviewer ? getPreviewer() : null;
                        const cellData = rowData.appears;
                        if (
                              isValidStartTime(cellData) &&
                              viewer &&
                              viewer.isLoaded() &&
                              !viewer.isDestroyed() &&
                              typeof viewer.play === 'function'
                          ) {
                              // $FlowFixMe Already checked above
                            const { start, end } = cellData[0];
                            viewer.play(start, end);
                        }
                    }}
                  >
                    <Column
                        dataKey='appears'
                        width={50}
                        flexShrink={0}
                        cellRenderer={({ cellData }): string =>
                              isValidStartTime(cellData) ? formatTime(cellData[0].start) : '--'}
                      />
                    <Column
                        dataKey='text'
                        width={240}
                        flexGrow={1}
                        cellRenderer={({ dataKey, parent, rowIndex, cellData }) =>
                            <CellMeasurer
                                cache={cache}
                                columnIndex={0}
                                key={dataKey}
                                parent={parent}
                                rowIndex={rowIndex}
                              >
                                <div
                                    className='buik-transcript-column'
                                    style={{
                                        whiteSpace: 'normal'
                                    }}
                                  >
                                    {(cellData || '').replace(/\r?\n|\r/g, '')}
                                </div>
                            </CellMeasurer>}
                      />
                </Table>}
        </AutoSizer>;

export default Transcript;
