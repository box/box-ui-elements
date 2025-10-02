const _excluded = ["className"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file HOC for drag drop
 * @author Box
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';
/* eslint-disable no-plusplus */
const makeDroppable = ({
  dropValidator,
  onDrop
}) => Wrapped => {
  var _DroppableComponent;
  return _DroppableComponent = class DroppableComponent extends PureComponent {
    /**
     * [constructor]
     *
     * @param {*} props
     * @return {DroppableComponent}
     */
    constructor(props) {
      super(props);
      /**
       * Ref callback to store the DOM element reference
       * @param {Element | null} element - The DOM element or null
       */
      _defineProperty(this, "setDroppableRef", element => {
        this.removeEventListeners(this.droppableEl);
        this.droppableEl = element;
        this.bindDragDropHandlers(element);
      });
      /**
       * Function that binds drag and drop related event listeners to the input element
       * @param {Element | null} element - The DOM element to attach listeners to
       */
      _defineProperty(this, "bindDragDropHandlers", element => {
        if (!element) {
          return;
        }
        element.addEventListener('dragenter', this.handleDragEnter);
        element.addEventListener('dragover', this.handleDragOver);
        element.addEventListener('dragleave', this.handleDragLeave);
        element.addEventListener('drop', this.handleDrop);
      });
      /**
       * Function that removes the drag and drop related event listeners on the input element
       * @param {Element | null} element - The DOM element to remove listeners from
       */
      _defineProperty(this, "removeEventListeners", element => {
        if (!element) {
          return;
        }
        element.removeEventListener('dragenter', this.handleDragEnter);
        element.removeEventListener('dragover', this.handleDragOver);
        element.removeEventListener('dragleave', this.handleDragLeave);
        element.removeEventListener('drop', this.handleDrop);
      });
      /**
       * Function that gets called when an item is dragged into the drop zone
       *
       * @param {SyntheticEvent} event - The dragenter event
       * @return {void}
       */
      _defineProperty(this, "handleDragEnter", event => {
        // This allows onDrop to be fired
        event.preventDefault();

        // Use this to track the number of drag enters and leaves.
        // This is used to normalize enters/leaves between parent/child elements

        // we only want to do things in dragenter when the counter === 1
        if (++this.enterLeaveCounter === 1) {
          const {
            dataTransfer
          } = event;

          // if we don't have a dropValidator, we just default canDrop to true
          const canDrop = dropValidator ? dropValidator(this.props, dataTransfer) : true;
          this.setState({
            isOver: true,
            canDrop
          });
        }
      });
      /**
       * Function that gets called when an item is dragged over the drop zone
       *
       * @param {DragEvent} event - The dragover event
       * @return {void}
       */
      _defineProperty(this, "handleDragOver", event => {
        // This allows onDrop to be fired
        event.preventDefault();
        const {
          canDrop
        } = this.state;
        const {
          dataTransfer
        } = event;
        if (!dataTransfer) {
          return;
        }
        if (!canDrop) {
          dataTransfer.dropEffect = 'none';
        } else if (dataTransfer.effectAllowed) {
          // Set the drop effect if it was defined
          dataTransfer.dropEffect = dataTransfer.effectAllowed;
        }
      });
      /**
       * Function that gets called when an item is drop onto the drop zone
       *
       * @param {DragEvent} event - The drop event
       * @return {void}
       */
      _defineProperty(this, "handleDrop", event => {
        event.preventDefault();

        // reset enterLeaveCounter
        this.enterLeaveCounter = 0;
        const {
          canDrop
        } = this.state;
        this.setState({
          canDrop: false,
          isDragging: false,
          isOver: false
        });
        if (canDrop && onDrop) {
          onDrop(event, this.props);
        }
      });
      /**
       * Function that gets called when an item is dragged out of the drop zone
       *
       * @param {DragEvent} event - The dragleave event
       * @return {void}
       */
      _defineProperty(this, "handleDragLeave", event => {
        event.preventDefault();

        // if enterLeaveCounter is zero, it means that we're actually leaving the item
        if (--this.enterLeaveCounter > 0) {
          return;
        }
        this.setState({
          canDrop: false,
          isDragging: false,
          isOver: false
        });
      });
      this.enterLeaveCounter = 0;
      this.state = {
        canDrop: false,
        isDragging: false,
        isOver: false
      };
    }

    /**
     * Removes event listeners when the component is going to unmount
     * @inheritdoc
     */
    componentWillUnmount() {
      this.removeEventListeners(this.droppableEl);
    }
    /**
     * Renders the HOC
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
      const _this$props = this.props,
        {
          className
        } = _this$props,
        rest = _objectWithoutProperties(_this$props, _excluded);
      const {
        canDrop,
        isOver
      } = this.state;
      const classes = classNames(className, {
        'is-droppable': canDrop,
        'is-over': isOver
      });
      const mergedProps = _objectSpread(_objectSpread(_objectSpread({}, rest), this.state), {}, {
        className: classes,
        ref: this.setDroppableRef
      });
      return /*#__PURE__*/React.createElement(Wrapped, mergedProps);
    }
  }, _defineProperty(_DroppableComponent, "defaultProps", {
    className: ''
  }), _DroppableComponent;
};
export default makeDroppable;
//# sourceMappingURL=makeDroppable.js.map