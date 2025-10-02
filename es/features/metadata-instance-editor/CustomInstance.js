function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import isEqual from 'lodash/isEqual';
import CustomNewField from './CustomInstanceNewField';
import CustomMetadataField from '../metadata-instance-fields/CustomMetadataField';
import EmptyContent from './EmptyContent';
import { FIELD_TYPE_STRING } from '../metadata-instance-fields/constants';
class CustomInstance extends React.PureComponent {
  static getDerivedStateFromProps({
    data
  }, {
    properties
  }) {
    if (!isEqual(data, properties)) {
      return {
        properties: _objectSpread({}, data)
      };
    }
    return null;
  }
  constructor(props) {
    super(props);
    /**
     * Adds/updates a new metadata key value pair
     *
     * @param {string} key - metadata key
     * @param {string} value - metadata value
     * @return {void}
     */
    _defineProperty(this, "onFieldChange", (key, value) => {
      const {
        canEdit,
        onFieldChange
      } = this.props;
      if (canEdit && onFieldChange) {
        onFieldChange(key, value, FIELD_TYPE_STRING);
      }
    });
    /**
     * Adds/updates a new metadata key value pair
     *
     * @param {string} key - metadata key
     * @param {string} value - metadata value
     * @return {void}
     */
    _defineProperty(this, "onFieldRemove", key => {
      const {
        canEdit,
        onFieldRemove
      } = this.props;
      if (canEdit && onFieldRemove) {
        onFieldRemove(key);
      }
    });
    /**
     * Shows the add new field field
     *
     * @return {void}
     */
    _defineProperty(this, "onAddFieldToggle", () => {
      this.setState(prevState => ({
        isAddFieldVisible: !prevState.isAddFieldVisible
      }));
    });
    this.state = {
      isAddFieldVisible: false,
      properties: _objectSpread({}, props.data)
    };
  }
  render() {
    const {
      canEdit
    } = this.props;
    const {
      isAddFieldVisible,
      properties
    } = this.state;
    const fields = Object.keys(properties);
    const canAddFields = canEdit && (isAddFieldVisible || fields.length === 0);
    return /*#__PURE__*/React.createElement(React.Fragment, null, fields.map((key, index) => /*#__PURE__*/React.createElement(CustomMetadataField, {
      key: key,
      canEdit: canEdit,
      dataKey: key,
      dataValue: properties[key],
      isLast: !isAddFieldVisible && index === fields.length - 1,
      onAdd: this.onAddFieldToggle,
      onChange: this.onFieldChange,
      onRemove: this.onFieldRemove
    })), !canAddFields && fields.length === 0 && /*#__PURE__*/React.createElement(EmptyContent, null), canAddFields && /*#__PURE__*/React.createElement(CustomNewField, {
      isCancellable: fields.length !== 0,
      onAdd: this.onFieldChange,
      onCancel: this.onAddFieldToggle,
      properties: this.props.data
    }));
  }
}
_defineProperty(CustomInstance, "defaultProps", {
  canEdit: true,
  data: {}
});
export default CustomInstance;
//# sourceMappingURL=CustomInstance.js.map