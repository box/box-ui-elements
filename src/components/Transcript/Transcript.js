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
import type { SkillCard, SkillCardEntryTimeSlice, SkillCardEntry } from '../../flowTypes';
import './Transcript.scss';

type Props = {
    skill: SkillCard,
    getPreviewer?: Function
};

const cache = new CellMeasurerCache({
    minHeight: 10,
    fixedWidth: true
});

const isValidStartTime = (cellData?: SkillCardEntryTimeSlice[]): boolean =>
    Array.isArray(cellData) && !!cellData[0] && typeof cellData[0].start === 'number';

const Transcript = ({ skill: { entries }, getPreviewer }: Props) =>
    entries.length === 1 && !isValidStartTime(entries[0].appears) ? (
        <span className='be-transcript'>{entries[0].text}</span>
    ) : (
        <AutoSizer disableHeight>
            {({ width }) => (
                <Table
                    width={width}
                    height={300}
                    disableHeader
                    headerHeight={0}
                    rowHeight={cache.rowHeight}
                    rowCount={entries.length}
                    rowGetter={({ index }) => entries[index]}
                    className='be-transcript'
                    deferredMeasurementCache={cache}
                    onRowClick={({ rowData }: { rowData: SkillCardEntry }): void => {
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
                            const { start } = cellData[0];
                            viewer.play(start);
                        }
                    }}
                >
                    <Column
                        dataKey='appears'
                        width={60}
                        flexShrink={0}
                        className='be-transcript-time-column'
                        cellRenderer={({ cellData }): string =>
                            isValidStartTime(cellData) ? formatTime(cellData[0].start) : '--'
                        }
                    />
                    <Column
                        dataKey='text'
                        width={230}
                        flexGrow={1}
                        cellRenderer={({ dataKey, parent, rowIndex, cellData }) => (
                            <CellMeasurer
                                cache={cache}
                                columnIndex={0}
                                key={dataKey}
                                parent={parent}
                                rowIndex={rowIndex}
                            >
                                <div
                                    className='be-transcript-column'
                                    style={{
                                        whiteSpace: 'normal'
                                    }}
                                >
                                    {(cellData || '').replace(/\r?\n|\r/g, '')}
                                </div>
                            </CellMeasurer>
                        )}
                    />
                </Table>
            )}
        </AutoSizer>
    );

export default Transcript;
