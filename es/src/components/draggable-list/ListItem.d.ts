import * as React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
export interface ListItemProps {
    children: React.ReactElement;
    draggableProvided: DraggableProvided;
    isDraggableViaHandle?: boolean;
}
declare const ListItem: ({ children, draggableProvided, isDraggableViaHandle }: ListItemProps) => React.JSX.Element;
export default ListItem;
