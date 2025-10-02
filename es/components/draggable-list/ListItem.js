function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import IconDrag from '../../icons/general/IconDrag';
const ListItem = ({
  children,
  draggableProvided,
  isDraggableViaHandle
}) => {
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: draggableProvided.innerRef,
    className: "draggable-list"
  }, draggableProvided.draggableProps, isDraggableViaHandle ? {} : draggableProvided.dragHandleProps), /*#__PURE__*/React.createElement("div", {
    className: "draggable-list-content"
  }, children), isDraggableViaHandle && /*#__PURE__*/React.createElement("div", _extends({
    className: "draggable-list-handle"
  }, draggableProvided.dragHandleProps), /*#__PURE__*/React.createElement(IconDrag, null)));
};
export default ListItem;
//# sourceMappingURL=ListItem.js.map