import * as React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import IconDrag from '../../icons/general/IconDrag';

export interface ListItemProps {
    children: React.ReactElement;
    draggableProvided: DraggableProvided;
    isDraggableViaHandle?: boolean;
}

const ListItem = ({ children, draggableProvided, isDraggableViaHandle }: ListItemProps) => {
    return (
        <div
            ref={draggableProvided.innerRef}
            className="draggable-list"
            {...draggableProvided.draggableProps}
            {...(isDraggableViaHandle ? {} : draggableProvided.dragHandleProps)}
        >
            <div className="draggable-list-content">{children}</div>
            {isDraggableViaHandle && (
                <div className="draggable-list-handle" {...draggableProvided.dragHandleProps}>
                    <IconDrag />
                </div>
            )}
        </div>
    );
};

export default ListItem;
