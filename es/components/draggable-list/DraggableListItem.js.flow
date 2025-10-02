// @flow
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ListItem from './ListItem';

type Props = {
    children: React.Node,
    id: string,
    index: number,
    isDraggableViaHandle?: boolean,
};

const DraggableListItem = ({ children, id, index, isDraggableViaHandle }: Props) => {
    return (
        <Draggable draggableId={id} index={index}>
            {draggableProvided => {
                return (
                    <ListItem draggableProvided={draggableProvided} isDraggableViaHandle={isDraggableViaHandle}>
                        {children}
                    </ListItem>
                );
            }}
        </Draggable>
    );
};

export default DraggableListItem;
