function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
class RadioGroup extends React.Component {
  constructor(props) {
    super(props);
    // @TODO: think about adding componentDidUpdate or gDSFP
    // to update the internal state value based on new props value
    _defineProperty(this, "onChangeHandler", event => {
      const {
        target
      } = event;
      const {
        onChange
      } = this.props;
      if (target instanceof HTMLInputElement) {
        this.setState({
          value: target.value
        });
      }
      if (onChange) {
        onChange(event);
      }
    });
    this.state = {
      value: props.value
    };
  }
  render() {
    const {
      children,
      className,
      name
    } = this.props;
    const {
      value: stateValue
    } = this.state;
    return /*#__PURE__*/React.createElement("div", {
      className: `radio-group ${className}`,
      onChange: this.onChangeHandler
    }, React.Children.map(children, radio => {
      const {
        value
      } = radio.props;
      return /*#__PURE__*/React.cloneElement(radio, {
        name,
        isSelected: value === stateValue
      });
    }));
  }
}
_defineProperty(RadioGroup, "defaultProps", {
  className: ''
});
export default RadioGroup;
//# sourceMappingURL=RadioGroup.js.map