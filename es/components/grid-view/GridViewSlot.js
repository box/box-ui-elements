import * as React from 'react';
import classNames from 'classnames';
import './GridViewSlot.scss';
const GridViewSlot = ({
  selected,
  slotIndex,
  slotRenderer,
  slotWidth
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "bdl-GridViewSlot",
    style: {
      maxWidth: slotWidth,
      flexBasis: slotWidth
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames('bdl-GridViewSlot-content', {
      'bdl-GridViewSlot-content--selected': selected
    })
  }, slotRenderer(slotIndex)));
};
export default GridViewSlot;
//# sourceMappingURL=GridViewSlot.js.map