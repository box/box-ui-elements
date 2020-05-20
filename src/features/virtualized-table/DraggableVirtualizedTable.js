// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { Column } from 'react-virtualized/dist/es/Table/index';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import type { DroppableProvided } from 'react-beautiful-dnd/src';
import type { VirtualizedTableProps } from './VirtualizedTable';

import { bdlGray } from '../../styles/variables';
import IconDrag from '../../icons/general/IconDrag';
import { draggableRowRenderer } from '../virtualized-table-renderers';

import VirtualizedTable from './VirtualizedTable';

import './DraggableVirtualizedTable.scss';

const ICON_SIZE = 24;

type Props = VirtualizedTableProps & {
    onDragEnd: (sourceIndex: number, destinationIndex: number) => void,
    shouldShowDragHandle?: boolean,
    tableId: string,
};

const DraggableVirtualizedTable = ({
    children,
    className,
    onDragEnd,
    shouldShowDragHandle,
    tableId,
    ...rest
}: Props) => {
    const tableClassName = classNames('bdl-DraggableVirtualizedTable', className);
    const draggableCellRenderer = () => <IconDrag color={bdlGray} height={ICON_SIZE} width={ICON_SIZE} />;

    const handleDragEnd = ({ destination, source }) => {
        const destinationIndex = destination ? destination.index : source.index;
        return onDragEnd(source.index, destinationIndex);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={tableId}>
                {(droppableProvided: DroppableProvided) => (
                    <div ref={droppableProvided.innerRef}>
                        <VirtualizedTable {...rest} className={tableClassName} rowRenderer={draggableRowRenderer}>
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
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

DraggableVirtualizedTable.displayName = 'DraggableVirtualizedTable';

DraggableVirtualizedTable.defaultProps = {
    onDragEnd: noop,
    shouldShowDragHandle: true,
};

export default DraggableVirtualizedTable;
