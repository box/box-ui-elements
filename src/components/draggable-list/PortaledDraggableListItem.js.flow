// @flow
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import Portal from '../portal';
import ListItem from './ListItem';

type Props = {
    children: React.Node,
    className?: string,
    id: string,
    index: number,
    isDraggableViaHandle?: boolean,
};

const PortaledDraggableListItem = ({ children, className = '', id, index, isDraggableViaHandle }: Props) => {
    return (
        <Draggable draggableId={id} index={index}>
            {(draggableProvided, draggableSnapshot) => {
                const listItem = (
                    <ListItem draggableProvided={draggableProvided} isDraggableViaHandle={isDraggableViaHandle}>
                        {children}
                    </ListItem>
                );

                if (draggableSnapshot.isDragging) {
                    return <Portal className={className}>{listItem}</Portal>;
                }
                return listItem;
            }}
        </Draggable>
    );
};

export default PortaledDraggableListItem;
