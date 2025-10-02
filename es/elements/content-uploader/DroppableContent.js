import * as React from 'react';
import ItemList from './ItemList';
import UploadState from './UploadState';
import makeDroppable from '../common/droppable';
import './DroppableContent.scss';
/**
 * Definition for drag and drop behavior.
 */
const dropDefinition = {
  /**
   * Validates whether a file can be dropped or not.
   */
  dropValidator: ({
    allowedTypes
  }, {
    types
  }) => {
    if (types instanceof Array) {
      return Array.from(types).some(type => allowedTypes.indexOf(type) > -1);
    }
    const allowedList = allowedTypes.filter(allowed => types.contains(allowed));
    return allowedList.length > 0;
  },
  /**
   * Determines what happens after a file is dropped
   */
  onDrop: (event, {
    addDataTransferItemsToUploadQueue
  }) => {
    const {
      dataTransfer
    } = event;
    addDataTransferItemsToUploadQueue(dataTransfer);
  }
};
const DroppableContentComponent = /*#__PURE__*/React.forwardRef(({
  addFiles,
  canDrop,
  isFolderUploadEnabled,
  isOver,
  isTouch,
  items,
  onClick,
  view
}, ref) => {
  const handleSelectFiles = ({
    target: {
      files
    }
  }) => addFiles(files);
  const hasItems = items.length > 0;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "bcu-droppable-content",
    "data-testid": "bcu-droppable-content"
  }, /*#__PURE__*/React.createElement(ItemList, {
    items: items,
    onClick: onClick
  }), /*#__PURE__*/React.createElement(UploadState, {
    canDrop: canDrop,
    hasItems: hasItems,
    isFolderUploadEnabled: isFolderUploadEnabled,
    isOver: isOver,
    isTouch: isTouch,
    onSelect: handleSelectFiles,
    view: view
  }));
});
const DroppableContent = makeDroppable(dropDefinition)(DroppableContentComponent);
export default DroppableContent;
//# sourceMappingURL=DroppableContent.js.map