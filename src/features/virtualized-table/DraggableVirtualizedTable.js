// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { Column } from '@box/react-virtualized/dist/es/Table/index';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import type { DroppableProvided } from 'react-beautiful-dnd';
import type { VirtualizedTableProps } from './VirtualizedTable';

import { bdlGray } from '../../styles/variables';
import IconDrag from '../../icons/general/IconDrag';
import { draggableRowRenderer } from '../virtualized-table-renderers';

import { VIRTUALIZED_TABLE_DEFAULTS } from './constants';
import VirtualizedTable from './VirtualizedTable';

import './DraggableVirtualizedTable.scss';

const { HEADER_HEIGHT, ROW_HEIGHT } = VIRTUALIZED_TABLE_DEFAULTS;
const ICON_SIZE = 24;

type Props = VirtualizedTableProps & {
    onDragEnd: (sourceIndex: number, destinationIndex: number) => void,
    shouldShowDragHandle?: boolean,
    tableId: string,
};

const DraggableVirtualizedTable = ({
    children,
    className,
    onDragEnd = noop,
    rowData,
    shouldShowDragHandle = true,
    tableId,
    ...rest
}: Props) => {
    const tableClassName = classNames('bdl-DraggableVirtualizedTable', className);
    const draggableCellRenderer = () => <IconDrag color={bdlGray} height={ICON_SIZE} width={ICON_SIZE} />;
    // Virtualized table's performance optimizations can not be used here since
    // all rows need to be rendered in order for drag and drop to work properly.
    // From a UX perspective, it also doesn't make sense to have drag and drop on
    // very large tables that actually require optimizations, so this component
    // always forces the table to be tall enough to fit all rows
    const tableHeight = rowData.length * ROW_HEIGHT + HEADER_HEIGHT;

    const handleDragEnd = ({ destination, source }) => {
        const destinationIndex = destination ? destination.index : source.index;
        return onDragEnd(source.index, destinationIndex);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={tableId}>
                {(droppableProvided: DroppableProvided) => (
                    <div ref={droppableProvided.innerRef}>
                        <VirtualizedTable
                            {...rest}
                            className={tableClassName}
                            rowRenderer={draggableRowRenderer}
                            height={tableHeight}
                            rowData={rowData}
                        >
                            {shouldShowDragHandle && (
                                <Column
                                    cellRenderer={draggableCellRenderer}
                                    className="bdl-DraggableVirtualizedTable-dragHandleColumn"
                                    dataKey="dragHandle"
                                    disableSort
                                    flexGrow={0}
                                    headerClassName="bdl-DraggableVirtualizedTable-dragHandleColumn"
                                    width={ICON_SIZE}
                                />
                            )}
                            {children}
                        </VirtualizedTable>
                        {droppableProvided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

DraggableVirtualizedTable.displayName = 'DraggableVirtualizedTable';

export default DraggableVirtualizedTable;
