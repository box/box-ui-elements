import * as React from 'react';
import { TextButton } from '@box/blueprint-web';
import { TYPE_FOLDER, TYPE_WEBLINK } from '../../../constants';
import './ItemName.scss';
const ItemName = ({
  item,
  onClick,
  onFocus,
  canPreview,
  isTouch
}) => {
  const {
    name,
    type
  } = item;
  const onItemFocus = onFocus ? () => onFocus(item) : null;
  const onItemClick = () => onClick(item);
  return type === TYPE_FOLDER || !isTouch && (type === TYPE_WEBLINK || canPreview) ? /*#__PURE__*/React.createElement(TextButton, {
    className: "be-item-label",
    inheritFont: true,
    onClick: onItemClick,
    onFocus: onItemFocus
  }, name) : /*#__PURE__*/React.createElement("span", {
    className: "be-item-label"
  }, name);
};
export default ItemName;
//# sourceMappingURL=ItemName.js.map