function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import SlideCarouselPrimitive from './SlideCarouselPrimitive';
import './SlideCarousel.scss';
class SlideCarousel extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "setSelectedIndex", index => {
      this.setState({
        selectedIndex: index
      });
    });
    this.id = uniqueId('slidecarousel');
    this.state = {
      selectedIndex: props.initialIndex || 0
    };
  }

  /*
   * If the selected index in the state has somehow gotten set to an
   * out of bounds value (either because we were passed a bad value,
   * or the number of children has reduced), compute a new selected
   * index which is a floored value between 0 <= index < num children
   */
  getBoundedSelectedIndex() {
    const {
      children
    } = this.props;
    const {
      selectedIndex
    } = this.state;
    const lastChildIndex = Math.max(React.Children.count(children) - 1, 0);
    const boundedSelectedIndex = Math.max(selectedIndex || 0, 0);
    return boundedSelectedIndex > lastChildIndex ? lastChildIndex : Math.floor(boundedSelectedIndex);
  }
  render() {
    const {
      children,
      className,
      contentHeight,
      title
    } = this.props;
    const selectedIndex = this.getBoundedSelectedIndex();
    return /*#__PURE__*/React.createElement(SlideCarouselPrimitive, {
      className: className,
      contentHeight: contentHeight,
      idPrefix: this.id,
      onSelection: this.setSelectedIndex,
      selectedIndex: selectedIndex,
      title: title
    }, children);
  }
}
_defineProperty(SlideCarousel, "defaultProps", {
  className: '',
  initialIndex: 0
});
export default SlideCarousel;
//# sourceMappingURL=SlideCarousel.js.map