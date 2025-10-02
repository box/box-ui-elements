import * as React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import './DraggableList.scss';
const DraggableList = ({
  children,
  className,
  listId,
  onDragEnd
}) => {
  return /*#__PURE__*/React.createElement(DragDropContext, {
    onDragEnd: result => {
      const destinationIndex = result.destination ? result.destination.index : result.source.index;
      return onDragEnd(result.source.index, destinationIndex);
    }
  }, /*#__PURE__*/React.createElement(Droppable, {
    droppableId: listId
  }, droppableProvided => /*#__PURE__*/React.createElement("div", {
    ref: droppableProvided.innerRef,
    className: className
  }, children, droppableProvided.placeholder)));
};
export default DraggableList;
//# sourceMappingURL=DraggableList.js.map