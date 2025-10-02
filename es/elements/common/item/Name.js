import * as React from 'react';
import ItemName from './ItemName';
import ItemDetails from './ItemDetails';
import { VIEW_SEARCH } from '../../../constants';
import './NameCell.scss';
const Name = ({
  canPreview = false,
  isTouch = false,
  item,
  onItemClick,
  onItemSelect,
  showDetails = true,
  rootId,
  view
}) => /*#__PURE__*/React.createElement("div", {
  className: "be-item-name"
}, /*#__PURE__*/React.createElement(ItemName, {
  canPreview: canPreview,
  isTouch: isTouch,
  item: item,
  onClick: onItemClick,
  onFocus: onItemSelect
}), view === VIEW_SEARCH || showDetails ? /*#__PURE__*/React.createElement(ItemDetails, {
  item: item,
  onItemClick: onItemClick,
  rootId: rootId,
  view: view
}) : null);
export default Name;
//# sourceMappingURL=Name.js.map