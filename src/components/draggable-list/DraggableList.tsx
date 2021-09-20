import * as React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import './DraggableList.scss';

export interface DraggableListProps {
    children: React.ReactNode;
    className?: string;
    listId: string;
    onDragEnd: (sourceIndex: number, destinationIndex: number) => void;
}

const DraggableList = ({ children, className, listId, onDragEnd }: DraggableListProps) => {
    return (
        <DragDropContext
            onDragEnd={result => {
                const destinationIndex = result.destination ? result.destination.index : result.source.index;
                return onDragEnd(result.source.index, destinationIndex);
            }}
        >
            <Droppable droppableId={listId}>
                {droppableProvided => (
                    <div ref={droppableProvided.innerRef} className={className}>
                        {children}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DraggableList;
