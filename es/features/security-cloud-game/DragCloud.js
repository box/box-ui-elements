function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import Draggable from 'react-draggable';
import IconCloud from '../../icons/general/IconCloud';
import messages from './messages';
import { getGridPosition } from './utils';
const DropShadowFilter = () => /*#__PURE__*/React.createElement("filter", {
  id: "drop-shadow"
}, /*#__PURE__*/React.createElement("feGaussianBlur", {
  in: "SourceAlpha",
  stdDeviation: "2"
}), /*#__PURE__*/React.createElement("feOffset", {
  dx: "2",
  dy: "2",
  result: "offsetblur"
}), /*#__PURE__*/React.createElement("feFlood", {
  floodColor: "black",
  floodOpacity: "0.3"
}), /*#__PURE__*/React.createElement("feComposite", {
  in2: "offsetblur",
  operator: "in"
}), /*#__PURE__*/React.createElement("feMerge", null, /*#__PURE__*/React.createElement("feMergeNode", null), /*#__PURE__*/React.createElement("feMergeNode", {
  in: "SourceGraphic"
})));
const DragCloud = ({
  cloudSize,
  disabled,
  gameBoardSize: {
    height,
    width
  },
  gridTrackSize,
  intl: {
    formatMessage
  },
  onDrop,
  position,
  updateLiveText,
  updatePosition
}) => {
  const nodeRef = React.useRef({});
  const [isMoving, setIsMoving] = useState(false);
  const dragCloudClasses = classNames('bdl-DragCloud', {
    'is-moving': isMoving
  });
  const moveLeft = () => {
    const newX = position.x - gridTrackSize;
    updatePosition(_objectSpread(_objectSpread({}, position), {}, {
      x: Math.max(newX, 0)
    }), true);
    if (newX < 0) {
      updateLiveText(formatMessage(messages.reachLeftEdge));
    }
  };
  const moveRight = () => {
    const maxX = width - cloudSize;
    const newX = position.x + gridTrackSize;
    updatePosition(_objectSpread(_objectSpread({}, position), {}, {
      x: Math.min(newX, maxX)
    }), true);
    if (newX > maxX) {
      updateLiveText(formatMessage(messages.reachRightEdge));
    }
  };
  const moveUp = () => {
    const newY = position.y - gridTrackSize;
    updatePosition(_objectSpread(_objectSpread({}, position), {}, {
      y: Math.max(newY, 0)
    }), true);
    if (newY < 0) {
      updateLiveText(formatMessage(messages.reachTopEdge));
    }
  };
  const moveDown = () => {
    const maxY = height - cloudSize;
    const newY = position.y + gridTrackSize;
    updatePosition(_objectSpread(_objectSpread({}, position), {}, {
      y: Math.min(newY, maxY)
    }), true);
    if (newY > maxY) {
      updateLiveText(formatMessage(messages.reachBottomEdge));
    }
  };
  const handleSpacebar = () => {
    const cloudStatusText = formatMessage(isMoving ? messages.cloudDropped : messages.cloudGrabbed);
    const currentPositionText = formatMessage(messages.currentPosition, getGridPosition(position, gridTrackSize));
    updateLiveText(`${cloudStatusText} ${currentPositionText}`, true);
    if (isMoving) {
      onDrop();
    }
    setIsMoving(!isMoving);
  };

  /**
   * DragCloud keyboard event handler. Supports Up/Down/Left/Right arrow keys and Spacebar
   * @param {KeyboardEvent} event - The drag event
   * @returns {void}
   */
  const onKeyDown = event => {
    if (disabled) {
      return;
    }
    if (isMoving) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.key === ' ') {
      handleSpacebar();
    } else if (isMoving) {
      switch (event.key) {
        case 'ArrowUp':
          moveUp();
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        default:
          break;
      }
    }
  };

  /**
   * Reset isMoving state when DragCloud loses focus
   * @returns {void}
   */
  const onBlur = () => setIsMoving(false);

  /**
   * DragCloud drag event handler. Updates current position.
   * @param {MouseEvent} e - The drag event
   * @param {object} { x, y } - Object which contains x and y coordinate of the drag event.
   * @returns {void}
   */
  const onDrag = throttle((e, {
    x,
    y
  }) => updatePosition({
    x,
    y
  }), 100, {
    leading: true,
    trailing: true
  });
  return /*#__PURE__*/React.createElement(Draggable, {
    nodeRef: nodeRef,
    bounds: "parent",
    disabled: disabled,
    onDrag: onDrag,
    onStop: onDrop,
    position: position
  }, /*#__PURE__*/React.createElement("div", {
    ref: nodeRef,
    className: dragCloudClasses,
    onBlur: onBlur,
    onKeyDown: onKeyDown,
    role: "button",
    tabIndex: 0
  }, /*#__PURE__*/React.createElement(IconCloud, {
    filter: {
      id: 'drop-shadow',
      definition: /*#__PURE__*/React.createElement(DropShadowFilter, null)
    },
    height: cloudSize,
    title: formatMessage(messages.cloudObject),
    width: cloudSize
  })));
};
DragCloud.displayName = 'DragCloud';
DragCloud.propTypes = {
  cloudSize: PropTypes.number,
  disabled: PropTypes.bool,
  gameBoardSize: PropTypes.objectOf(PropTypes.number),
  gridTrackSize: PropTypes.number,
  intl: PropTypes.any,
  position: PropTypes.objectOf(PropTypes.number).isRequired,
  onDrop: PropTypes.func,
  updateLiveText: PropTypes.func,
  updatePosition: PropTypes.func
};

// Actual export
export { DragCloud as DragCloudBase };
export default injectIntl(DragCloud);
//# sourceMappingURL=DragCloud.js.map