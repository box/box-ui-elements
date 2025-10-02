const _excluded = ["children", "className", "targetWrapperClassName", "constrainToScrollParent", "constrainToWindow", "position", "isShown", "offset", "tetherElementClassName"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import TetherComponent from 'react-tether';
import TetherPosition from '../../common/tether-positions';
import './RadarAnimation.scss';
export let RadarAnimationPosition = /*#__PURE__*/function (RadarAnimationPosition) {
  RadarAnimationPosition["BOTTOM_CENTER"] = "bottom-center";
  RadarAnimationPosition["BOTTOM_LEFT"] = "bottom-left";
  RadarAnimationPosition["BOTTOM_RIGHT"] = "bottom-right";
  RadarAnimationPosition["MIDDLE_CENTER"] = "middle-center";
  RadarAnimationPosition["MIDDLE_LEFT"] = "middle-left";
  RadarAnimationPosition["MIDDLE_RIGHT"] = "middle-right";
  RadarAnimationPosition["TOP_CENTER"] = "top-center";
  RadarAnimationPosition["TOP_LEFT"] = "top-left";
  RadarAnimationPosition["TOP_RIGHT"] = "top-right";
  return RadarAnimationPosition;
}({});
const positions = {
  [RadarAnimationPosition.BOTTOM_CENTER]: {
    attachment: TetherPosition.TOP_CENTER,
    targetAttachment: TetherPosition.BOTTOM_CENTER
  },
  [RadarAnimationPosition.BOTTOM_LEFT]: {
    attachment: TetherPosition.TOP_LEFT,
    targetAttachment: TetherPosition.BOTTOM_LEFT
  },
  [RadarAnimationPosition.BOTTOM_RIGHT]: {
    attachment: TetherPosition.TOP_RIGHT,
    targetAttachment: TetherPosition.BOTTOM_RIGHT
  },
  [RadarAnimationPosition.MIDDLE_CENTER]: {
    attachment: TetherPosition.MIDDLE_CENTER,
    targetAttachment: TetherPosition.MIDDLE_CENTER
  },
  [RadarAnimationPosition.MIDDLE_LEFT]: {
    attachment: TetherPosition.MIDDLE_RIGHT,
    targetAttachment: TetherPosition.MIDDLE_LEFT
  },
  [RadarAnimationPosition.MIDDLE_RIGHT]: {
    attachment: TetherPosition.MIDDLE_LEFT,
    targetAttachment: TetherPosition.MIDDLE_RIGHT
  },
  [RadarAnimationPosition.TOP_CENTER]: {
    attachment: TetherPosition.BOTTOM_CENTER,
    targetAttachment: TetherPosition.TOP_CENTER
  },
  [RadarAnimationPosition.TOP_LEFT]: {
    attachment: TetherPosition.BOTTOM_LEFT,
    targetAttachment: TetherPosition.TOP_LEFT
  },
  [RadarAnimationPosition.TOP_RIGHT]: {
    attachment: TetherPosition.BOTTOM_RIGHT,
    targetAttachment: TetherPosition.TOP_RIGHT
  }
};
class RadarAnimation extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "tetherRef", /*#__PURE__*/React.createRef());
    _defineProperty(this, "radarAnimationID", uniqueId('radarAnimation'));
    // Instance API: Forces the radar to be repositioned
    _defineProperty(this, "position", () => {
      const {
        isShown
      } = this.props;
      if (this.tetherRef.current && isShown) {
        this.tetherRef.current.position();
      }
    });
  }
  render() {
    const _this$props = this.props,
      {
        children,
        className = '',
        targetWrapperClassName,
        constrainToScrollParent,
        constrainToWindow,
        position,
        isShown,
        offset,
        tetherElementClassName
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const constraints = [];
    if (constrainToScrollParent) {
      constraints.push({
        to: 'scrollParent',
        attachment: 'together'
      });
    }
    if (constrainToWindow) {
      constraints.push({
        to: 'window',
        attachment: 'together'
      });
    }
    const {
      attachment,
      targetAttachment
    } = positions[position];
    const child = React.Children.only(children);
    const referenceElement = /*#__PURE__*/React.cloneElement(child, {
      'aria-describedby': this.radarAnimationID
    });
    const tetherProps = {
      attachment,
      classPrefix: 'radar-animation',
      constraints,
      enabled: isShown,
      targetAttachment
    };
    if (tetherElementClassName) {
      tetherProps.className = tetherElementClassName;
    }
    if (offset) {
      tetherProps.offset = offset;
    }
    return /*#__PURE__*/React.createElement(TetherComponent, _extends({
      ref: this.tetherRef
    }, tetherProps, {
      renderTarget: ref => /*#__PURE__*/React.createElement("div", {
        ref: ref,
        className: classNames('bdl-RadarAnimation-target', targetWrapperClassName)
      }, referenceElement),
      renderElement: ref => /*#__PURE__*/React.createElement("div", _extends({
        ref: ref,
        className: `radar ${className}`,
        id: this.radarAnimationID
      }, rest), /*#__PURE__*/React.createElement("div", {
        className: "radar-dot"
      }), /*#__PURE__*/React.createElement("div", {
        className: "radar-circle"
      }))
    }));
  }
}
_defineProperty(RadarAnimation, "defaultProps", {
  constrainToScrollParent: false,
  constrainToWindow: true,
  isShown: true,
  position: RadarAnimationPosition.MIDDLE_RIGHT
});
export default RadarAnimation;
//# sourceMappingURL=RadarAnimation.js.map