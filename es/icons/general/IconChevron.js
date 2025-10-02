import * as React from 'react';
export let DirectionType = /*#__PURE__*/function (DirectionType) {
  DirectionType["DOWN"] = "down";
  DirectionType["LEFT"] = "left";
  DirectionType["RIGHT"] = "right";
  DirectionType["UP"] = "up";
  return DirectionType;
}({});
const rotations = {
  [DirectionType.DOWN]: 135,
  [DirectionType.LEFT]: 225,
  [DirectionType.RIGHT]: 45,
  [DirectionType.UP]: 315
};
const IconChevron = ({
  className = '',
  color = '#000',
  direction = DirectionType.UP,
  size = '9px',
  thickness = '2px'
}) => /*#__PURE__*/React.createElement("span", {
  className: `icon-chevron icon-chevron-${direction} ${className}`,
  style: {
    borderColor: color,
    borderStyle: 'solid solid none none',
    borderWidth: thickness,
    display: 'inline-block',
    height: size,
    transform: `rotate(${rotations[direction]}deg)`,
    width: size
  }
});
export default IconChevron;
//# sourceMappingURL=IconChevron.js.map