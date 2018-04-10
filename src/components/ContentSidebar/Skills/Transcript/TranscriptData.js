/**
 * @flow
 * @file Transcript grid component
 * @author Box
 */

import React from 'react';
import { Table, Column } from 'react-virtualized/dist/es/Table';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import 'react-virtualized/styles.css';
import { formatTime } from 'box-react-ui/lib/utils/datetime';
import { isValidTimeSlice } from './timeSliceUtils';
import type { SkillCardEntry } from '../../../../flowTypes';
import './Transcript.scss';

type Props = {
    data: SkillCardEntry[],
    onInteraction: Function,
    getPreviewer?: Function
};

const cache = new CellMeasurerCache({
    minHeight: 10,
    fixedWidth: true
});

const TranscriptData = ({ data, getPreviewer, onInteraction }: Props) => (
    <AutoSizer>
        {({ width, height }) => (
            <Table
                width={width}
                height={height}
                disableHeader
                headerHeight={0}
                rowHeight={cache.rowHeight}
                rowCount={data.length}
                rowGetter={({ index }) => data[index]}
                className='be-transcript'
                deferredMeasurementCache={cache}
                onRowClick={({ rowData }: { rowData: SkillCardEntry }): void => {
                    const viewer = getPreviewer ? getPreviewer() : null;
                    const { appears } = rowData;
                    const validStartTime = isValidTimeSlice(appears);

                    if (validStartTime) {
                        // $FlowFixMe Already checked above in isValidTimeSlice
                        const entry = appears[0];
                        onInteraction({ target: 'transcript' });

                        if (viewer && viewer.isLoaded() && !viewer.isDestroyed() && typeof viewer.play === 'function') {
                            const { start } = entry;
                            viewer.play(start);
                        }
                    }
                }}
            >
                <Column
                    dataKey='appears'
                    width={60}
                    flexShrink={0}
                    className='be-transcript-time-column'
                    cellRenderer={({ cellData }): string =>
                        isValidTimeSlice(cellData) ? formatTime(cellData[0].start) : '--'
                    }
                />
                <Column
                    dataKey='text'
                    width={230}
                    flexGrow={1}
                    cellRenderer={({ dataKey, parent, rowIndex, cellData }) => (
                        <CellMeasurer cache={cache} columnIndex={0} key={dataKey} parent={parent} rowIndex={rowIndex}>
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

export default TranscriptData;
