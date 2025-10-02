import * as React from 'react';
import './DraggableList.scss';
export interface DraggableListProps {
    children: React.ReactNode;
    className?: string;
    listId: string;
    onDragEnd: (sourceIndex: number, destinationIndex: number) => void;
}
declare const DraggableList: ({ children, className, listId, onDragEnd }: DraggableListProps) => React.JSX.Element;
export default DraggableList;
