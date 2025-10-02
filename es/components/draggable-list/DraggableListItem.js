import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ListItem from './ListItem';
const DraggableListItem = ({
  children,
  id,
  index,
  isDraggableViaHandle
}) => {
  return /*#__PURE__*/React.createElement(Draggable, {
    draggableId: id,
    index: index
  }, draggableProvided => {
    return /*#__PURE__*/React.createElement(ListItem, {
      draggableProvided: draggableProvided,
      isDraggableViaHandle: isDraggableViaHandle
    }, children);
  });
};
export default DraggableListItem;
//# sourceMappingURL=DraggableListItem.js.map