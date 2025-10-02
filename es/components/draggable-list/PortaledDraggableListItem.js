import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Portal from '../portal';
import ListItem from './ListItem';
const PortaledDraggableListItem = ({
  children,
  className = '',
  id,
  index,
  isDraggableViaHandle
}) => {
  return /*#__PURE__*/React.createElement(Draggable, {
    draggableId: id,
    index: index
  }, (draggableProvided, draggableSnapshot) => {
    const listItem = /*#__PURE__*/React.createElement(ListItem, {
      draggableProvided: draggableProvided,
      isDraggableViaHandle: isDraggableViaHandle
    }, children);
    if (draggableSnapshot.isDragging) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return /*#__PURE__*/React.createElement(Portal, {
        className: className
      }, listItem);
    }
    return listItem;
  });
};
export default PortaledDraggableListItem;
//# sourceMappingURL=PortaledDraggableListItem.js.map