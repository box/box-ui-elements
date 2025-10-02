// @flow
import * as React from 'react';
import IconDrag from '../../icons/general/IconDrag';

type Props = {
    children: React.Node,
    draggableProvided: Object,
    isDraggableViaHandle?: boolean,
};

const ListItem = ({ children, draggableProvided, isDraggableViaHandle }: Props) => {
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
